const uname = {
  id: 'uname',
  description: 'print operating system name',
  args: 0,
  async exec(term, _args) {
    term.writeln(navigator.userAgent);
  }
}

export default uname;
