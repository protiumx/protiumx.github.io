import fileSystem from "../file-system.js";
import {TermColors} from "../constants.js";
import {colorize, downloadFile, sleep} from "../utils.js";

const download = {
  id: "download",
  args: 1,
  usage: 'download filename',
  description: 'download a file',
  async exec(term, args) {
    const file = fileSystem.get(args[0]);
    if (!file) {
      term.writeln(colorize(TermColors.Red, '[error]: ') + `"${args[0]}" no such a file`);
      return;
    }
    let url = file.path;
    if (file.virtual) {
      // Create blob from content
      url = `data:text/plain;charset=utf-8,${encodeURIComponent(file.content)}`;
    }
    term.writeln(colorize(TermColors.Green, `downloading ${file.name} ...`));
    await sleep(1000);
    downloadFile(url, file.downloadName ?? file.name);
  },
};

export default download;

