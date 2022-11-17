import { TermColors } from "../constants.js";
import { colorize } from "../utils.js";

let info = colorize(TermColors.Green, "User Agent: ");
info += navigator.userAgent + "\r\n";
info += colorize(TermColors.Green, "Host: ");
info += location.hostname;

const uname = {
  id: "uname",
  description: "print operating system name",
  args: 0,
  async exec(term, _args) {
    term.writeln(info);
  },
};

export default uname;
