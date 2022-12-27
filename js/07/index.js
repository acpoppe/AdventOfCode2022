const fs = require("fs");
const filename = "input.txt";
console.time("time");

const sizeLimit = 100000;
const diskspaceAvailable = 70000000;
const neededSpace = 30000000;

let input = fs.readFileSync(filename, "utf8").split("\n$ ");

class Directory {
  name;
  parent;
  directories;
  files;

  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
    this.directories = [];
    this.files = [];
  }

  getCWD(path) {
    let cwd;
    for (let i = 0; i < path.length; i++) {
      if (path[i] === "/") {
        cwd = this;
        continue;
      }
      cwd = cwd.directories[path[i]];
    }
    return cwd;
  }

  getPath() {
    if (this.name === "/") {
      return ["/"];
    }

    let path = this.parent.getPath();
    path.push(this.name);
    return path;
  }

  getSize() {
    let size = 0;
    for (let i = 0; i < this.files.length; i++) {
      size += this.files[i].getSize();
    }

    for (let directory in this.directories) {
      size += this.directories[directory].getSize();
    }

    return size;
  }

  totalOfDirectoriesUnderSizeLimit() {
    let total = 0;
    for (let directory in this.directories) {
      if (this.directories[directory].getSize() < sizeLimit) {
        total += this.directories[directory].getSize();
      }
      total += this.directories[directory].totalOfDirectoriesUnderSizeLimit();
    }
    return total;
  }

  sizeOfDirectoryToDelete(totalUsed) {
    let smallestSizeForViableDelete = -1;
    for (let directory in this.directories) {
      if (
        totalUsed - this.directories[directory].getSize() <
        diskspaceAvailable - neededSpace
      ) {
        if (
          smallestSizeForViableDelete === -1 ||
          this.directories[directory].getSize() < smallestSizeForViableDelete
        )
          smallestSizeForViableDelete = this.directories[directory].getSize();
      }
      if (
        this.directories[directory].sizeOfDirectoryToDelete(totalUsed) !== -1 &&
        this.directories[directory].sizeOfDirectoryToDelete(totalUsed) <
          smallestSizeForViableDelete
      )
        smallestSizeForViableDelete =
          this.directories[directory].sizeOfDirectoryToDelete(totalUsed);
    }
    return smallestSizeForViableDelete;
  }
}

class File {
  name;
  parent;
  size;

  constructor(name, parent, size) {
    this.name = name;
    this.parent = parent;
    this.size = Number(size);
  }

  getSize() {
    return this.size;
  }
}

function mapTree(input) {
  if (input[0] !== "$ cd /") {
    throw new Error();
  }
  input.shift();

  let root = new Directory("/", null);
  let currentPath = ["/"];
  while (input.length > 0) {
    currentPath = processCMD(input, root, currentPath);
  }
  return root;
}

function processCMD(nextCommands, tree, path) {
  let cmd = nextCommands[0];
  let cwd = tree.getCWD(path);

  if (cmd.startsWith("ls")) {
    let contents = cmd.split("\n");
    contents.shift();
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].startsWith("dir")) {
        let [_, name] = contents[i].split(" ");
        let dir = new Directory(name, cwd);
        cwd.directories[name] = dir;
      } else {
        let [size, name] = contents[i].split(" ");
        let file = new File(name, cwd, size);
        cwd.files.push(file);
      }
    }

    nextCommands.shift();
    return cwd.getPath();
  }

  if (cmd.startsWith("cd")) {
    let [_, dir] = cmd.split(" ");
    if (dir === "..") {
      nextCommands.shift();
      const prev = cwd.getPath();
      prev.pop();
      return prev;
    }

    if (dir in cwd.directories) {
      nextCommands.shift();
      return cwd.directories[dir].getPath();
    }
  }
}

let tree = mapTree(input);
console.log(`Part 1: ${tree.totalOfDirectoriesUnderSizeLimit()}`);

// Part 2
const totalUsed = tree.getSize();
console.log(`Part 2: ${tree.sizeOfDirectoryToDelete(totalUsed)}`);

console.timeEnd("time");
