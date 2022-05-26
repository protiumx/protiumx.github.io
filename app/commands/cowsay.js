import { getSpacing } from "../utils.js";

const cowsay = {
  id: "cowsay",
  args: -1,
  description: 'cowsay nice things. max 20 chars',
  usage: 'cowsay [something ...]',
  async exec(term, args) {
    const max = 20;
    const say = args.join(' ').slice(0, max);
    let spacing = 12 - Math.floor(say.length / 2);
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
};

export default cowsay;
