const Files = [
  {
    name: 'blog.md',
    content: '',
    path: '/blog.md',
    deleted: false,
  },
  {
    name: "resume.pdf",
    path: "/files/resume.pdf",
    content: '',
    deleted: false,
    downloadName: 'brian_mayo_resume.pdf',
  },
  {
    name: 'projects.md',
    deleted: false,
    path: '/files/projects.md',
    content: ''
  }
];


async function loadFile(file) { 
  const res = await fetch(file.path);
  file.content = await res.text();
}

const fileSystem = {
  get(fileName) {
    return this.files.find(f => f.name === fileName);
  },

  getAll() {
    return this.files.map(f => f.name);
  },

  get files() {
    return Files.filter(f => !f.deleted);
  },

  async load() {
    const tasks = [];
    for (const file of Files.filter(f => f.name.includes('.md'))) {
      tasks.push(loadFile(file));
    }
    await Promise.all(tasks);
  },

  remove(fileName) {
    const file = this.get(fileName);
    if (file) {
      file.deleted = true;
    }
  },
};

export default fileSystem;
