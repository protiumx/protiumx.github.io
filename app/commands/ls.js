import fileSystem from "../file-system.js";

const ls = {
  id: "ls",
  description: 'list files',
  args: 0,
  async exec(term, _args) {
    for (const file of fileSystem.getAll()) {
      term.write(file + '\t\t');
    }
  }
};

export default ls;
