const simia = {
  id: "simia",
  args: 0,
  description: "simia lang REPL",
  application: true,
  loaded: false,
  supported: true,
  currentInput: "",
  prompt(term) {
    term.write("\r\n>> ");
  },

  async exec(term, _args) {
    term.write("\x1b[2J");
    term.write("\x1b[0;0f");
    if (!this.loaded) {
      term.write("loading...");
      await this.load();
    }
    this.prompt(term);
  },

  async load() {
    this.loaded = true;
  },

  /**
   * @param {KeyboardEvent} ev
   */
  processInput(ev) {},

  exit(term) {
    term.clear();
    this.currentInput = "";
  },
};

export default simia;
