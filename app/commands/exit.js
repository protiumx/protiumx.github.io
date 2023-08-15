import { sleep } from "../utils.js";

export async function exec(term, _args) {
  term.writeln('terminating session...');
  await sleep(1000);
  window.location.href = 'https://www.youtube.com/watch?v=iik25wqIuFo'; // ;)
}

const exit = {
  id: "exit",
  args: 0,
  description: 'terminate current session',
  exec
};

export default exit;
