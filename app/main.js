import { TermColors, SHELL_PROMPT } from './constants.js';
import fileSystem from './file-system.js';
import { sleep } from './utils.js';
import { exec } from './commands/index.js';

function commandNotFound(term) {
  term.writeln(TermColors.Red + 'Command not found. Type "help" to list available commands');
}

function prompt(term) {
  term.write('\r\n' + SHELL_PROMPT);
};

function deleteCurrentInput(term, input) {
  let i = 0;
  while (i < input.length){
    term.write('\b \b');
    i++;
  }
}

async function initTerminalSession(term) {
  term.writeln('creating new session...');
  await sleep(2000);
  term.write(SHELL_PROMPT);
}

function pushToCommandHistory(store, command) {
  // Avoid duplicates with last command
  if (store.length > 0 && store[store.length - 1] === command) {
    return;
  }
  store.push(command);
  localStorage.setItem('history', JSON.stringify(store));
}

function loadCommandHistory() {
  const data = localStorage.getItem('history');
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function createOnKeyHandler(term) {
  // Track the user input
  let userInput = '';
  // Track command history
  let commandHistory = loadCommandHistory();
  let currentHistoryPosition = commandHistory.length;

  return async ({ key, domEvent: ev }) => {
    const printable = (!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey);

    if(ev.keyCode === 9 || ev.keyCode == 37 || ev.keyCode == 39) {
      return;
    }

    if (ev.ctrlKey && ev.key === 'c') {
      prompt(term);
      userInput = '';
      currentHistoryPosition = commandHistory.length;
      return;
    }

    if (ev.ctrlKey && ev.key === 'l') {
      term.clear();
      return;
    }

    // Delete char
    if (ev.keyCode == 8) {
      if (userInput.length > 0) {
        if (term._core.buffer.x === 0 && term._core.buffer.y > 1) {
          // Move up
          term.write('\x1b[A');
          // Move to the end of line
          term.write('\x1b[' + term._core.buffer._cols + 'G');
          term.write(' ');
        } else {
          term.write('\b \b');
        }

        userInput = userInput.substring(0, userInput.length-1);
      }
      return;
    }

    // Run command enter
    if (ev.keyCode == 13) {
      userInput = userInput.trim();
      if (userInput.length === 0) {
        userInput = '';
        prompt(term);
        return;
      }

      term.writeln('');
      const result = await exec(userInput, term);
      if (!result) {
        commandNotFound(term);        
      }
      if (commandHistory.length > 100) {
        commandHistory = commandHistory.slice(100 - commandHistory.length);
      }
      pushToCommandHistory(commandHistory, userInput);
      currentHistoryPosition = commandHistory.length;
      prompt(term);
      userInput = '';
      return;
    }

    // Up in the history
    if (ev.keyCode == 38) {
      if (commandHistory.length > 0) {
        currentHistoryPosition = Math.max(0, currentHistoryPosition - 1);
        deleteCurrentInput(term, userInput);
        userInput = commandHistory[currentHistoryPosition];
        term.write(userInput);
      }
      return;
    }

    // Down in the history
    if (ev.keyCode == 40) {  
      if (commandHistory.length > 0) {
        currentHistoryPosition = Math.min(commandHistory.length, currentHistoryPosition + 1);

        deleteCurrentInput(term, userInput);
        if (currentHistoryPosition === commandHistory.length) {
          userInput = '';
          term.write(userInput);
        } else {
          userInput = commandHistory[currentHistoryPosition]
          term.write(userInput);
        }
      }
      return;
    }

    if (printable) {
      term.write(key);
      userInput += key;
    }
  }
}

async function runTerminal() {
  const container = document.getElementById('term');
  const term = new Terminal({
    cursorBlink: "block",
    scrollback: 1000,
    tabStopWidth: 4,
    fontFamily: 'CascadiaMono, courier-new, courier, monospace',
    fontSize: 18,
    theme: {
      background: '#060606',
      cursor: '#c7157a',
      selection: '#c7157a',
      cursorAccent: '#c7157a',
      brightMagenta: '#c7157a',
      green: '#2ab025',
      brightGreen: '#2ab025',
      yellow: '#f2ca29',
      brightYellow: '#f2ca29',
      red: '#cf442b',
      brightRed: '#cf442b',
    }
  });

  const fitAddon = new window.FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(new window.WebLinksAddon.WebLinksAddon());
  term.open(container);
  fitAddon.fit();
  
  term.focus();
  await initTerminalSession(term);

  term.onKey(createOnKeyHandler(term));
}

window.onload = function() {
  fileSystem.load().catch(console.error);
  runTerminal().catch(console.error);
};
