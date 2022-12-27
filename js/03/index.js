const fs = require("fs");
console.time("time");

const filename = "input.txt";

let letterValues = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((letter, index) => {
    return { letter, value: index + 1 };
  });

function getValueOf(letter) {
  return letterValues.find((item) => item.letter === letter).value;
}

function getSharedLetter(packContents) {
  const otherContents = packContents[1].split("");

  for (const firstContent of packContents[0].split("")) {
    if (otherContents.includes(firstContent)) {
      return firstContent;
    }
  }
}

const data = fs.readFileSync(filename, "utf8");

let parts = data.split("\n").map((line) => {
  let partLength = line.length / 2;
  return [line.substring(0, partLength), line.substring(partLength)];
});

let values = parts
  .map((packContents) => {
    return getSharedLetter(packContents);
  })
  .reduce((acc, letter) => {
    return acc + getValueOf(letter);
  }, 0);

console.log("Part 1: " + values);

// Part 2

function findBadgeLetter(group) {
  const secondGroupContents = group[1].split("");
  const thirdGroupContents = group[2].split("");

  for (const firstGroupContents of group[0].split("")) {
    if (
      secondGroupContents.includes(firstGroupContents) &&
      thirdGroupContents.includes(firstGroupContents)
    ) {
      return firstGroupContents;
    }
  }
}

let groups = [];

data.split("\n").forEach((line, index) => {
  if (index % 3 === 0) {
    groups.push([line]);
    return;
  }
  groups[Math.floor(index / 3)].push(line);
});

let badgeValue = groups
  .map((group) => {
    return findBadgeLetter(group);
  })
  .reduce((acc, letter) => {
    return acc + getValueOf(letter);
  }, 0);

console.log("Part 2: " + badgeValue);

console.timeEnd("time");
