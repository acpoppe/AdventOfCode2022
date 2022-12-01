const fs = require("fs");

const file = fs.readFileSync("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  return data;
});

const input = file.split("\n\n");

const packs = input.map((pack) => {
  return pack.split("\n");
});

const totals = packs.map((pack) => {
  const total = pack.reduce((acc, cur) => {
    return acc + Number(cur);
  }, 0);
  return total;
});

let highestTotal = 0;

totals.forEach((total) => {
  if (total > highestTotal) {
    highestTotal = total;
  }
});
console.log("Part 1: " + highestTotal);

// Part 2

let top3Totals = [];

totals.forEach((total) => {
  if (top3Totals.length < 3) {
    top3Totals.push(total);
  } else {
    top3Totals.sort((a, b) => b - a);
    if (total > top3Totals[2]) {
      top3Totals[2] = total;
    }
  }
});

const total = top3Totals.reduce((acc, cur) => {
  return acc + cur;
});

console.log("Part 2: " + total);
