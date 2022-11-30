import { TermColors } from "../constants.js";
import { colorize, getSpacing } from "../utils.js";

import cat from "./cat.js";
import cowsay from "./cowsay.js";
import download from "./download.js";
import exit from "./exit.js";
import ls from "./ls.js";
import open from "./open.js";
import randc from "./randc.js";
import rm from "./rm.js";
import simia from "./simia.js";
import uname from "./uname.js";
import whoami from "./whoami.js";

const SystemCommands = [
  cat,
  cowsay,
  download,
  exit,
  ls,
  open,
  randc,
  rm,
  simia,
  uname,
  whoami,

  {
    id: "help",
    args: 0,
    async exec(term, _args) {
      term.writeln("available commands:");
      // Add 3 tabs for spacing. Align each description to the first command description
      const firstCommandSpacing = SystemCommands[0].id.length + 12;
      for (const { id, description } of SystemCommands) {
        if (id === "help") continue;

        term.writeln(
          "\t" +
            colorize(TermColors.Green, id) +
            getSpacing(firstCommandSpacing - id.length) +
            description
        );
      }
    },
  },

  {
    id: "id",
    usage: "id command",
    description: "returns user identity",
    args: 0,
    async exec(term) {
      term.writeln("uid=001(anonymous)");
    },
  },

  {
    id: "man",
    usage: "man command",
    description: "show manual pages for a command",
    args: 1,
    async exec(term, args) {
      const command = SystemCommands.find((c) => c.id === args[0]);
      if (!command) {
        term.writeln(
          colorize(TermColors.Red, `[error]: command "${args[0]}" not found`)
        );
        return;
      }
      term.writeln("NAME");
      term.writeln(`\t ${command.id} - ${command.description}`);
      if (command.usage) {
        term.writeln("\nSYNOPSIS");
        term.writeln(`\t ${command.usage}`);
      }
    },
  },
];

/**
 * @returns {string|null} Process ID if command executed started a process
 * */
export async function exec(term, userInput, onProcessExit) {
  // Handle arguments check here to avoid duplication
  const [input, ...args] = userInput.split(/\s+/);
  const command = SystemCommands.find((c) => c.id === input);
  if (!command) {
    throw new Error(
      'Command not found. Type "help" to list available commands'
    );
  }

  if (command.args === 0 && args.length > 0) {
    throw new Error(`${command.id} does not accept arguments`);
  }

  if (
    (command.args === -1 && args.length === 0) ||
    (command.args !== -1 && command.args !== args.length)
  ) {
    throw new Error(
      "not enough arguments\r\n" +
        colorize(TermColors.Reset, `usage: ${command.usage}`)
    );
  }

  await command.exec(term, args, onProcessExit);
  if (command.process) {
    return command.id;
  }

  return null;
}
