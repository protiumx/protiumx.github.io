import { TermColors } from "../constants.js";
import { colorize, sleep } from "../utils.js";

const WebApps = [
  {
    name: 'blog',
    url: 'https://protiumx.dev/blog/'
  },
  {
    name: 'github',
    url: 'https://github.com/protiumx/'
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/_protium/'
  },
  {
    name: 'issues',
    url: 'https://github.com/protiumx/protiumx.github.io/issues/'
  },
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/in/bdmayo/'
  },
  {
    name: 'resume',
    url: 'https://protiumx.dev/files/resume.pdf'
  },
  {
    name: 'source',
    url: 'https://github.com/protiumx/protiumx.github.io'
  }
];

const open = {
  id: "open",
  description: 'open applications',
  usage: `open [${WebApps.map(app => app.name).join(' | ')}]`,
  args: 1,
  async exec(term, args) {
    const app = WebApps.find(a => a.name === args[0]);
    if (!app) {
      term.writeln(colorize(TermColors.Red, '[error]: ') + `"${args[0]}" not found`);
      term.writeln(this.usage);
      return;
    }
    term.writeln(`opening ${args[0]}...`);
    await sleep(1000);
    window.open(app.url);
  }
};

export default open;


