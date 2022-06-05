import { parse } from "https://deno.land/x/xml/mod.ts";

const res = await fetch('https://protiumx.dev/blog/index.xml');
const rss = parse(await res.text()).rss! as any;

const output = [];
for (const {title, link} of rss.channel.item) {
  output.push(`# ${title}\r\n${link}\r\n`);
}
await Deno.stdout.write(new TextEncoder().encode(output.join('\n')));

