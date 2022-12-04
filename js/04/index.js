const fs = require("fs");

function isFullyContained(pair) {
  let [firstRange, secondRange] = pair.split(",").map(makeRange);
  let rangeContains = (check, against) =>
    against.every((v) => check.includes(v));

  return (
    rangeContains(firstRange, secondRange) ||
    rangeContains(secondRange, firstRange)
  );
}

function containsAtAll(pair) {
  let [firstRange, secondRange] = pair.split(",").map(makeRange);
  let rangeContains = (check, against) =>
    against.some((v) => check.includes(v));

  return (
    rangeContains(firstRange, secondRange) ||
    rangeContains(secondRange, firstRange)
  );
}

function makeRange(range) {
  let [min, max] = range.split("-");
  return [...Array(Number(max) - Number(min) + 1).keys()].map(
    (i) => i + Number(min)
  );
}

const filename = "input.txt";

const pairs = fs.readFileSync(filename, "utf8").split("\n");

let count = pairs.map(isFullyContained).filter((v) => v).length;
console.log(`Part 1: ${count}`);

// Part 2

let overlapCount = pairs.map(containsAtAll).filter((v) => v).length;
console.log(`Part 2: ${overlapCount}`);
