const fs = require("fs");

const filename = "input.txt";
let instructions = fs.readFileSync(filename, "utf8").split("\n");

function addInstructionToQueue(operation, value) {
  let instruction = {
    cycleToComplete: currentCycle + (cycles.get(operation) - 1),
    operation: operation,
    value: value,
  };
  instructionQueue.push(instruction);
  instructionQueue.sort((a, b) => a.cycleToComplete - b.cycleToComplete);
}

function completeExistingInstructions() {
  let instruction = instructionQueue[0];
  if (instruction && instruction.cycleToComplete === currentCycle) {
    if (instruction.operation === "addx") {
      x += parseInt(instruction.value);
    }
    instructionQueue.shift();
  }
}

function draw() {
  let row = parseInt((currentCycle - 1) / 40);
  let col = parseInt((currentCycle - 1) % 40);
  if (col === 0) {
    drawn.push([]);
  }
  if (col <= x + 1 && col >= x - 1) {
    drawn[row].push("██");
    return;
  }
  drawn[row].push("  ");
}

function tick() {
  draw();
  if (instructions.length > 0 && instructionQueue.length === 0) {
    let instruction = instructions[0];
    let [operation, value] = instruction.split(" ");
    addInstructionToQueue(operation, value);
    instructions.shift();
  }
  completeExistingInstructions();
  currentCycle++;
  if ((currentCycle - 20) % 40 === 0) {
    calcs.push(x * currentCycle);
  }
}

let x = 1;
let currentCycle = 1;

let cycles = new Map();
cycles.set("addx", 2);
cycles.set("noop", 1);

let instructionQueue = [];

let drawn = [];

let calcs = [];

while (instructions.length > 0 || instructionQueue.length > 0) {
  tick();
}

console.log(`Part 1: ${calcs.reduce((a, b) => a + b)}`);

// Part 2

function printScreen() {
  for (let i = 0; i < drawn.length; i++) {
    drawn[i] = drawn[i].join("");
  }
  return drawn.join("\n");
}

console.log(`Part 2: \n${printScreen()}`);
