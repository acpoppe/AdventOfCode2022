const fs = require("fs");
const filename = "input.txt";
console.time("time");

const [stacks, instructions] = fs.readFileSync(filename, "utf8").split("\n\n");

function parseInputStacks(stacks) {
  let splitStacks = stacks.split("\n");
  let labelRow = splitStacks[splitStacks.length - 1].split("");
  let parsedStacks = [];
  labelRow.forEach((char, index) => {
    if (char !== " ") {
      parsedStacks.push(parseStackAt(splitStacks, index));
    }
  });
  return parsedStacks;
}

function parseStackAt(splitStacks, position) {
  let stack = [];
  let charRows = splitStacks.map((row) => row.split(""));
  for (let i = splitStacks.length - 2; i >= 0; i--) {
    if (charRows[i][position] !== " ") {
      stack.push(charRows[i][position]);
    }
  }
  return stack;
}

function parseInstructions(instructions) {
  let splitInstructions = instructions.split("\n");
  return splitInstructions
    .map((instruction) => {
      return instruction.substring(5).split(" from ");
    })
    .map((instruction) => {
      return [instruction[0], instruction[1].split(" to ")];
    });
}

function executeInstructions(instructions, stacks) {
  instructions.forEach((instruction) => {
    let [count, [from, to]] = instruction;
    for (let i = 0; i < count; i++) {
      stacks[to - 1].push(stacks[from - 1].pop());
    }
  });
  return stacks;
}

function getTopCrates(stacks) {
  return stacks.map((stack) => stack[stack.length - 1]);
}

let parsedStacks = parseInputStacks(stacks);
let parsedInstructions = parseInstructions(instructions);
let topCrates = getTopCrates(
  executeInstructions(parsedInstructions, parsedStacks)
);

console.log(`Part 1: ${topCrates.join("")}`);

// Part 2

function executeInstructions9001(instructions, stacks) {
  instructions.forEach((instruction) => {
    let [count, [from, to]] = instruction;
    let toMove = stacks[from - 1].slice(stacks[from - 1].length - count);
    for (let i = 0; i < count; i++) {
      stacks[from - 1].pop();
    }
    stacks[to - 1] = stacks[to - 1].concat(toMove);
  });
  return stacks;
}

let topCrates9001 = getTopCrates(
  executeInstructions9001(parsedInstructions, parseInputStacks(stacks))
);

console.log(`Part 2: ${topCrates9001.join("")}`);

console.timeEnd("time");
