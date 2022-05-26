import { TermColors } from "../constants.js";
import { colorize } from "../utils.js";

const KeyBindings = [
  {
    name: 'ctrl + p',
    action: 'print last command',
  },
  {
    name: 'ctrl + l',
    action: 'clear screen',
  },
  {
    name: 'ctrl + c',
    action: 'kill a process with signal SIGINT',
  },
]

const bindkey = {
  id: 'bindkey',
  description: 'show key bindings',
  args: 0,
  async exec(term, _args) {
    for (const binding of KeyBindings) {
      term.writeln(colorize(TermColors.Green, `"${binding.name}"\t`) + binding.action);
    }
  },
};

export default bindkey;
