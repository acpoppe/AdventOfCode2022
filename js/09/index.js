const fs = require("fs");
const filename = "input.txt";
console.time("time");

function convertPosToKey(pos) {
  return `${pos.x},${pos.y}`;
}

function convertKeyToPos(key) {
  const [x, y] = key.split(",").map(Number);
  return { x: x, y: y };
}

function move(instruction, knotPositions, visitedSet) {
  let [direction, distance] = instruction.split(" ");
  distance = Number(distance);
  for (let i = 0; i < distance; i++) {
    for (let j = 0; j < knotPositions.length; j++) {
      if (j === 0) {
        switch (direction) {
          case "U":
            knotPositions[j].y += 1;
            break;
          case "D":
            knotPositions[j].y -= 1;
            break;
          case "L":
            knotPositions[j].x -= 1;
            break;
          case "R":
            knotPositions[j].x += 1;
            break;
        }
      } else {
        moveTrailing(knotPositions[j - 1], knotPositions[j]);
        if (j === knotPositions.length - 1) {
          visitedSet.add(convertPosToKey(knotPositions[j]));
        }
      }
    }
  }
  return [knotPositions, visitedSet];
}

function moveTrailing(headPos, tailPos) {
  if (Math.abs(headPos.x - tailPos.x) === 2) {
    if (headPos.x < tailPos.x) {
      tailPos.x -= 1;
    } else {
      tailPos.x += 1;
    }
    if (headPos.y !== tailPos.y) {
      if (headPos.y < tailPos.y) {
        tailPos.y -= 1;
      } else {
        tailPos.y += 1;
      }
    }
  }

  if (Math.abs(headPos.y - tailPos.y) === 2) {
    if (headPos.y < tailPos.y) {
      tailPos.y -= 1;
    } else {
      tailPos.y += 1;
    }
    if (headPos.x !== tailPos.x) {
      if (headPos.x < tailPos.x) {
        tailPos.x -= 1;
      } else {
        tailPos.x += 1;
      }
    }
  }
  return tailPos;
}

let input = fs.readFileSync(filename, "utf8").split("\n");

let knotPositions = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];
let visited = new Set();

for (let i = 0; i < input.length; i++) {
  [knotPositions, visitedSet] = move(input[i], knotPositions, visited);
}

console.log(`Part 1: ${visited.size}`);

// Part 2

let part2KnotPositions = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];
let part2Visited = new Set();

for (let i = 0; i < input.length; i++) {
  [part2KnotPositions, part2Visited] = move(
    input[i],
    part2KnotPositions,
    part2Visited
  );
}

console.log(`Part 2: ${part2Visited.size}`);

console.timeEnd("time");
