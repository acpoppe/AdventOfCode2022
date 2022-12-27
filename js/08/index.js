const fs = require("fs");
const filename = "input.txt";
console.time("time");

function isVisible(x, y, highestSoFar, input, total) {
  let add = false;
  if (input[x][y].height > highestSoFar) {
    if (!input[x][y].visible) {
      add = true;
    }
    input[x][y].visible = true;
    highestSoFar = input[x][y].height;
  }
  if (add) {
    return [highestSoFar, total + 1];
  }
  return [highestSoFar, total];
}

function getScenicScore(x, y, input) {
  const treeHeight = input[y][x].height;

  let upScore = 0;
  let downScore = 0;
  let leftScore = 0;
  let rightScore = 0;

  for (let i = y; i < input.length; i++) {
    if (i !== y) {
      upScore++;
      if (input[i][x].height >= treeHeight) {
        break;
      }
    }
  }
  for (let i = y; i >= 0; i--) {
    if (i !== y) {
      downScore++;
      if (input[i][x].height >= treeHeight) {
        break;
      }
    }
  }
  for (let i = x; i < input[0].length; i++) {
    if (i !== x) {
      rightScore++;
      if (input[y][i].height >= treeHeight) {
        break;
      }
    }
  }
  for (let i = x; i >= 0; i--) {
    if (i !== x) {
      leftScore++;
      if (input[y][i].height >= treeHeight) {
        break;
      }
    }
  }

  input[y][x].scenicScore = upScore * downScore * leftScore * rightScore;
}

let input = fs
  .readFileSync(filename, "utf8")
  .split("\n")
  .map((line) => line.split(""));

let parsed = input.map((line) => {
  return line.map((char) => {
    return { height: Number(char), visible: false };
  });
});

let total = 0;

for (let i = 0; i < parsed.length; i++) {
  let highestSoFarLeft = -1;
  for (let j = 0; j < parsed[0].length; j++) {
    if (highestSoFarLeft != 9) {
      [highestSoFarLeft, total] = isVisible(
        j,
        i,
        highestSoFarLeft,
        parsed,
        total
      );
    }
  }
}
for (let k = 0; k < parsed.length; k++) {
  let highestSoFarRight = -1;
  for (let l = parsed[0].length - 1; l >= 0; l--) {
    if (highestSoFarRight != 9) {
      [highestSoFarRight, total] = isVisible(
        l,
        k,
        highestSoFarRight,
        parsed,
        total
      );
    }
  }
}

for (let m = 0; m < parsed[0].length; m++) {
  let highestSoFarTop = -1;
  for (let n = 0; n < parsed.length; n++) {
    if (highestSoFarTop != 9) {
      [highestSoFarTop, total] = isVisible(
        m,
        n,
        highestSoFarTop,
        parsed,
        total
      );
    }
  }
}

for (let o = 0; o < parsed[0].length; o++) {
  let highestSoFarBot = -1;
  for (let p = parsed.length - 1; p >= 0; p--) {
    if (highestSoFarBot != 9) {
      [highestSoFarBot, total] = isVisible(
        o,
        p,
        highestSoFarBot,
        parsed,
        total
      );
    }
  }
}

console.log(`Part 1: ${total}`);

// Part 2

let p2Parsed = input.map((line) => {
  return line.map((char) => {
    return { height: Number(char), scenicScore: 0 };
  });
});

for (let q = 0; q < p2Parsed.length; q++) {
  for (let r = 0; r < p2Parsed[0].length; r++) {
    getScenicScore(q, r, p2Parsed);
  }
}

let max = 0;

for (let y = 0; y < p2Parsed.length; y++) {
  for (let z = 0; z < p2Parsed[0].length; z++) {
    if (p2Parsed[y][z].scenicScore > max) {
      max = p2Parsed[y][z].scenicScore;
    }
  }
}

console.log(`Part 2: ${max}`);

console.timeEnd("time");
