import fileSystem from '../file-system.js';
import { TermColors } from '../constants.js';
import { colorize } from '../utils.js';

function parseGlobPattern(pattern) {
  switch(pattern) {
    case '*':
    case '/*':
      return fileSystem.getAll();
    default:
      return [];
  }
}

const rm = {
  id: "rm",
  description: 'remove files',
  usage: 'rm [file ...]',
  args: -1,
  async exec(term, args) {
    for (const fileName of args) {
      const globFiles = parseGlobPattern(fileName);
      if (globFiles.length) {
        for (const globFile of globFiles) {
          fileSystem.remove(globFile);
        }
        continue;
      }
      const file = fileSystem.get(fileName);
      if (!file) {
        term.writeln(colorize(TermColors.Red, '[error]: ') + `"${fileName}": No such a file or directory`);
      } else {
        fileSystem.remove(fileName);
      }
    }
  }
};

export default rm;


