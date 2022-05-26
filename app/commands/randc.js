import {TermColors} from "../constants.js";
import {colorize, sleep} from "../utils.js";

const randc = {
  id: "randc",
  description: 'get a random cat photo',
  args: 0,
  async exec(term, _args) {
    term.writeln('getting a cato...');
    try {
      const res = await fetch('https://cataas.com/cat?json=true');
      if (!res.ok) {
        term.writeln(colorize(TermColors.Red, `[error] no catos today :( -- ${res.statusText}`));
      } else {
        const {url} = await res.json();
        term.writeln(colorize(TermColors.Green, 'opening cato...'));
        await sleep(1000);
        window.open('https://cataas.com' + url);
      }
    } catch (e) {
      term.writeln(colorize(TermColors.Red, `[error] no catos today :( -- ${e.message}`));
    }
  },
};

export default randc;
