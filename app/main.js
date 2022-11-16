import { HistorySize, TermColors, SHELL_PROMPT } from "./constants.js";
import fileSystem from "./file-system.js";
import { isPrintableKeyCode, sleep } from "./utils.js";
import { exec } from "./commands/index.js";

function commandNotFound(term) {
  term.writeln(
    TermColors.Red + 'Command not found. Type "help" to list available commands'
  );
}

function prompt(term) {
  term.write("\r\n" + SHELL_PROMPT);
}

function deleteCurrentInput(term, input) {
  let i = 0;
  while (i < input.length) {
    term.write("\b \b");
    i++;
  }
}

async function initTerminalSession(term) {
  term.writeln("creating new session...");
  await sleep(1300);
  term.write(SHELL_PROMPT);
}

function pushCommandToHistory(store, command) {
  // Avoid duplicates with last command
  if (store.length > 0 && store[store.length - 1] === command) {
    return;
  }
  store.push(command);
  setTimeout(() => localStorage.setItem("history", JSON.stringify(store)), 0);
}

function loadCommandHistory() {
  const data = localStorage.getItem("history");
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse command history", e);
    return [];
  }
}

function createOnKeyHandler(term) {
  // Track the user input
  let userInput = "";
  // Track command history
  let commandHistory = loadCommandHistory();
  let currentHistoryPosition = commandHistory.length;

  return async ({ key, domEvent: ev }) => {
    switch (ev.key) {
      case "ArrowUp":
      case "ArrowDown": {
        if (commandHistory.length === 0) {
          return;
        }

        if (ev.key === "ArrowDown") {
          // restore input
          if (currentHistoryPosition === commandHistory.length) return;

          currentHistoryPosition = Math.min(
            commandHistory.length,
            currentHistoryPosition + 1
          );
        } else {
          currentHistoryPosition = Math.max(0, currentHistoryPosition - 1);
        }

        deleteCurrentInput(term, userInput);
        if (currentHistoryPosition === commandHistory.length) {
          userInput = "";
        } else {
          userInput = commandHistory[currentHistoryPosition];
        }
        term.write(userInput);
        return;
      }

      case "c": {
        if (ev.ctrlKey) {
          prompt(term);
          userInput = "";
          currentHistoryPosition = commandHistory.length;
          return;
        }
        break;
      }

      case "l": {
        if (ev.ctrlKey) {
          term.clear();
          return;
        }
        break;
      }

      case "Backspace": {
        if (userInput.length === 0) return;

        if (term._core.buffer.x === 0 && term._core.buffer.y > 1) {
          // Move up
          term.write("\x1b[A");
          // Move to the end
          term.write("\x1b[" + term._core.buffer._cols + "G");
          term.write(" ");
        } else {
          term.write("\b \b");
        }
        userInput = userInput.substring(0, userInput.length - 1);
        return;
      }

      case "Enter": {
        userInput = userInput.trim();
        if (userInput.length === 0) {
          userInput = "";
          prompt(term);
          return;
        }

        term.writeln("");
        const result = await exec(userInput, term);
        if (!result) {
          commandNotFound(term);
        }

        if (commandHistory.length > HistorySize) {
          commandHistory = commandHistory.slice(
            HistorySize - commandHistory.length
          );
        }
        pushCommandToHistory(commandHistory, userInput);
        currentHistoryPosition = commandHistory.length;
        prompt(term);
        userInput = "";
        return;
      }
    }

    const hasModifier = ev.altKey || ev.altGraphKey || ev.ctrlKey || ev.metaKey;

    if (!hasModifier && isPrintableKeyCode(ev.keyCode)) {
      term.write(key);
      userInput += key;
    }
  };
}

async function runTerminal() {
  const container = document.getElementById("term");
  const term = new Terminal({
    cursorBlink: "block",
    scrollback: 1000,
    tabStopWidth: 4,
    fontFamily: "monospace, courier-new, courier",
    fontSize: 20,
    theme: {
      background: "#060606",
      cursor: "#c7157a",
      selection: "#c7157a",
      cursorAccent: "#c7157a",
      brightMagenta: "#c7157a",
      green: "#2ab025",
      brightGreen: "#2ab025",
      yellow: "#f2ca29",
      brightYellow: "#f2ca29",
      red: "#cf442b",
      brightRed: "#cf442b",
    },
  });
  // window.term = term;

  const fitAddon = new window.FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(new window.WebLinksAddon.WebLinksAddon());
  term.open(container);

  fitAddon.fit();
  term.focus();

  await initTerminalSession(term);

  term.onKey(createOnKeyHandler(term));
}

window.onload = function () {
  fileSystem.load().catch(console.error);
  runTerminal().catch(console.error);
};
