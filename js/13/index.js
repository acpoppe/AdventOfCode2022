const fs = require("fs");
const filename = "input.txt";
console.time("time");

function comparePair(first, second) {
  if (
    !first ||
    first === "" ||
    first === undefined ||
    Object.keys(first).length === 0
  ) {
    return -1;
  }
  if (
    !second ||
    second === "" ||
    second === undefined ||
    Object.keys(second).length === 0
  ) {
    return 1;
  }

  if (!isNaN(Number(first)) && !isNaN(Number(second))) {
    if (Number(first) < Number(second)) {
      return -1;
    }
    if (Number(first) === Number(second)) {
      return 0;
    }
    if (Number(first) > Number(second)) {
      return 1;
    }
  }

  let newFirst = first;
  let newSecond = second;
  if (isNaN(Number(first))) {
    newFirst = first.substring(1, first.length - 1);
    newFirst = parseItem(newFirst);
  }

  if (isNaN(Number(second))) {
    newSecond = second.substring(1, second.length - 1);
    newSecond = parseItem(newSecond);
  }

  if (!isNaN(Number(newFirst))) {
    newFirst = [newFirst];
  }
  if (!isNaN(Number(newSecond))) {
    newSecond = [newSecond];
  }

  for (let i = 0; i < Math.max(newFirst.length, newSecond.length); i++) {
    let result = comparePair(newFirst[i], newSecond[i]);
    if (result === 1) {
      return 1;
    }
    if (result === -1) {
      return -1;
    }
    if (Math.min(newFirst.length, newSecond.length) === i + 1) {
      if (newFirst.length === i + 1 && newFirst.length !== newSecond.length)
        return -1;
      if (newSecond.length === i + 1 && newFirst.length !== newSecond.length)
        return 1;
      return result;
    }
  }
  return true;
}

function parseItem(input) {
  let result = [],
    item = "",
    depth = 0;

  function push() {
    if (item) result.push(item);
    item = "";
  }

  for (let i = 0, c; (c = input[i]), i < input.length; i++) {
    if (!depth && c === ",") push();
    else {
      item += c;
      if (c === "[") depth++;
      if (c === "]") depth--;
    }
  }

  push();
  return result;
}

let pairs = fs
  .readFileSync(filename, "utf8")
  .split("\n\n")
  .map((x) => x.split("\n"));

const properlySortedIndices = [];

for (let i = 0; i < pairs.length; i++) {
  let first = pairs[i][0];
  let second = pairs[i][1];
  if (comparePair(first, second) === -1) {
    properlySortedIndices.push(i + 1);
  }
}

console.log(`Part 1: ${properlySortedIndices.reduce((a, b) => a + b, 0)}`);

// Part 2
flatPairs = pairs.flatMap((x) => x);
flatPairs.push("[[2]]");
flatPairs.push("[[6]]");

flatPairs.sort((a, b) => comparePair(a, b));

console.log(
  `Part 2: ${
    (flatPairs.indexOf("[[6]]") + 1) * (flatPairs.indexOf("[[2]]") + 1)
  }`
);

console.timeEnd("time");
