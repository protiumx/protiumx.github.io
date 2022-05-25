import { TermColors } from './constants.js';
import { colorize, getSpacing, sleep } from './utils.js';

let files = [
  {
    name: 'blog',
    content: '',
  },

  {
    name: 'projects',
    content: colorize(TermColors.Green, 'blogpub: github action to publish blog posts from github to Medium or Dev.to') + '\r\nhttps://github.com/protiumx/blogpub\r\n\n' +
    colorize(TermColors.Green, 'algo: coding problems with modern languages, TDD and CI') + '\r\nhttps://github.com/protiumx/algo\r\n\n' +
    colorize(TermColors.Green, 'rq: HTTP Rest parser written in rust') + '\r\nhttps://github.com/protiumx/rq'
  }
];

const webApps = [
  {
    name: 'blog',
    url: 'https://protiumx.github.io/blog/'
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
    name: 'linkedin',
    url: 'https://www.linkedin.com/in/bdmayo/'
  },
  {
    name: 'resume',
    url: 'https://protiumx.github.io/cv.pdf'
  },
  {
    name: 'source',
    url: 'https://github.com/protiumx/protiumx.github.io'
  }
];

const SystemCommands = [
  {
    id: "cat",
    description: 'print files',
    usage(term) {
      term.writeln('usage: cat [file ...]');
    },
    args: -1,
    async run(term, args) {
      for (const file of args) {
        const systemFile = files.find(({ name }) => name === file);
        if (!systemFile) {
          term.writeln(TermColors.Red + '[error]: ' + TermColors.Reset + `"${file}": No such a file or directory`);
        } else {
          term.writeln(systemFile.content);
        }
      }
    }
  },

  {
    id: "cowsay",
    args: -1,
    description: 'cowsay nice things. max 20 chars',
    async run(term, args) {
      const max = 20;
      const say = args.join(' ').slice(0, max);
      let spacing = 12 - Math.floor(say.length/2);
      if (say.length % 2 !== 0) {
        --spacing;
      }
      term.writeln('  ' + getSpacing(max + 4, '_') + '  ');
      term.writeln('< ' + getSpacing(spacing) + say + getSpacing(spacing) + ' >');
      term.writeln('  ' + getSpacing(max + 4, '-') + '  ');
      term.writeln(`   \\   ^__^ `);
      term.writeln(`    \\  (oo)\\_______`);
      term.writeln(`       (__)\\       )\\/\\`);
      term.writeln(`           ||----w |`);
      term.writeln(`           ||     ||`);
      term.writeln(`           -      -`);
    },
  },

  {
    id: "exit",
    args: 0,
    description: 'exit current session',
    async run(term, args) {
      term.writeln('terminating session...');
      await sleep(1000);
      window.close();
    },
  },

  {
    id: 'help',
    args: 0,
    async run(term) {
      term.writeln('available commands:');
      // Add 3 tabs for spacing. Align each description to the first command description
      const firstCommandSpacing = SystemCommands[0].id.length + 12;
      for (const { id, description } of SystemCommands) {
        if (id === 'help') continue;

        term.writeln('\t' + TermColors.Green + id + TermColors.Reset + getSpacing(firstCommandSpacing - id.length) + description);
      }
    },
  },

  {
    id: "ls",
    description: 'list files',
    args: 0,
    run(term, args) {
      for (const file of files) {
        term.write(file.name + '\t\t');
      }
    },
  },

  {
    id: "open",
    description: 'open applications',
    usage(term) {
      term.writeln(`usage: open [${webApps.map(app => app.name).join(' | ')}]`);
    },
    args: 1,
    async run(term, args) {
      const app = webApps.find(a => a.name === args[0]);
      if (!app) {
        term.writeln(colorize(TermColors.Red, '[error]: ') + `"${args[0]}" not found` );
        this.usage(term);
        return;
      }
      term.writeln(`opening ${args[0]}...`);
      await sleep(1000);
      window.open(app.url);
    },
  },

  {
    id: "randc",
    description: 'get a random cat photo',
    args: 0,
    async run(term, args) {
      term.writeln('getting a cato...');
      const res = await fetch('https://cataas.com/cat?json=true');
      if (!res.ok) {
        term.writeln(colorize(TermColors.Red, `[error] no catos toda :( -- ${res.statusText}`));
      }  else {
        const { url } = await res.json();
        term.writeln(colorize(TermColors.Green, 'opening cato...'));
        await sleep(1000);
        window.open('https://cataas.com' + url);
      }
    },
  },

  {
    id: "rm",
    description: 'remove a file',
    usage(term) {
      term.writeln('usage: rm file');
    },
    args: 1,
    async run(term, args) {
      const systemFile = files.find(({ name }) => name === args[0]);
      if (!systemFile) {
        term.writeln(TermColors.Red + '[error]: ' + TermColors.Reset + `"${args[0]}": No such a file or directory`);
      } else {
        files = files.filter(({ name }) => name != systemFile.name);
      }
    }
  },

  {
    id: "whoami",
    args: 0,
    description: 'display effective developer info',
    run(term, args) {
      term.writeln(colorize(TermColors.Green, 'name: ') + 'brian');
      term.writeln(colorize(TermColors.Green, 'current position: ') + 'software engineer');
      term.writeln(colorize(TermColors.Green, 'company: ') + 'Hearbeat Medical Solutions < https://heartbeat-med.de >');
      term.writeln(colorize(TermColors.Green, 'location: ') + 'Munich, Germany');
      term.writeln(colorize(TermColors.Green, 'fav languages: ') + '[golang, rust, typescript]');
      term.writeln(colorize(TermColors.Green, 'hobbies: ') + '[photography, music, electronics]');
      term.writeln(colorize(TermColors.Green, 'blog: ') + 'https://protiumx.github.com/blog');
      term.writeln(colorize(TermColors.Green, 'last update: ') + '2022-05-24');
    },
  },
];

// Runs a command.
// Return false if no command found
export async function runCommand(userInput, term) {
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
      await command.run(term, args);
      return true;
    }

    if (command.args > args.length) {
      term.writeln(colorize(TermColors.Red, 'wrong arguments'));
      command.usage(term);
    } else {
      await command.run(term, args);
    }
  } else {
    if (command.args === 0) {
      await command.run(term, args);
    } else {
      term.writeln(colorize(TermColors.Red, 'wrong arguments'));
      command.usage(term);
    }
  }
  return true;
}

export async function fecthLastPosts() {
  // Use RSS feed
  const res = await fetch('https://protiumx.github.io/blog/index.xml');
  const text = await res.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text,"text/xml");
  const posts = xmlDoc.getElementsByTagName('item');
  const lastPosts = [];
  for (let i = 0; i < 5; i++) {
    const title = posts[i].getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const link = posts[i].getElementsByTagName('link')[0].childNodes[0].nodeValue;
    lastPosts.push(TermColors.Green + title + `\r\n${TermColors.Reset}${link}\r\n`);
  }

  files[0].content = lastPosts.join('\n');
}
