import {TermColors} from '../constants.js';
import { colorize, getSpacing} from '../utils.js';

import cat from './cat.js';
import cowsay from './cowsay.js';
import download from './download.js';
import exit from './exit.js';
import ls from './ls.js';
import open from './open.js';
import randc from './randc.js';
import rm from './rm.js';
import whoami from './whoami.js';

const SystemCommands = [
  cat,
  cowsay,
  download,
  exit,
  ls,
  open,
  randc,
  rm,
  whoami,

  {
    id: 'help',
    args: 0,
    async exec(term, _args) {
      term.writeln('available commands:');
      // Add 3 tabs for spacing. Align each description to the first command description
      const firstCommandSpacing = SystemCommands[0].id.length + 12;
      for (const {id, description} of SystemCommands) {
        if (id === 'help') continue;

        term.writeln('\t' + colorize(TermColors.Green, id) + getSpacing(firstCommandSpacing - id.length) + description);
      }
    },
  },
];

export async function exec(userInput, term) {
  const [input, ...args] = userInput.split(' ');
  const command = SystemCommands.find(c => c.id === input);
  if (!command) {
    return false;
  }

  if (args.length > 0) {
    if (command.args === 0) {
      term.writeln(colorize(TermColors.Red, `${command.id} does not accept arguments`));
      return true;
    }

    if (command.args === -1) {
      // Accepts 1 or more
      await command.exec(term, args);
      return true;
    }

    if (command.args !== args.length) {
      term.writeln(colorize(TermColors.Red, 'wrong arguments'));
      term.writeln(command.usage);
    } else {
      await command.exec(term, args);
    }
  } else {
    if (command.args === 0) {
      await command.exec(term, args);
    } else {
      term.writeln(colorize(TermColors.Red, 'wrong arguments'));
      term.writeln(command.usage);
    }
  }
  return true;
}