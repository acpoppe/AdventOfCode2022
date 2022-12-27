const fs = require("fs");
const filename = "input.txt";
console.time("time");

function makeMap(maxX, minX, maxY) {
  let map = [];
  for (let i = 0; i <= maxY + 1; i++) {
    for (let j = minX - 1; j <= maxX + 1; j++) {
      if (i >= 0 && j >= 0) {
        map[`${j},${i}`] = ".";
      }
    }
  }
  return map;
}

function printMap(map) {
  let lastY = -1;
  let row = "";
  for (key in map) {
    [x, y] = key.split(",");
    x = parseInt(x);
    y = parseInt(y);
    if (lastY != y && y != -1) {
      row += "\n";
    }
    if (lastY != y) {
      lastY = y;
    }
    row += map[key];
  }
  return row;
}

function getBounds(walls) {
  walls.map((wall) => {
    wall.split(" -> ").map((point) => {
      let [x, y] = point.split(",");
      x = parseInt(x);
      y = parseInt(y);
      if (x > maxX) maxX = x;
      if (x < minX) minX = x;
      if (y > maxY) maxY = y;
    });
  });
}

function addWalls(map, walls) {
  walls.map((wall) => {
    let points = wall.split(" -> ");
    let [x1, y1] = points[0].split(",");
    for (let i = 1; i < points.length; i++) {
      let [x2, y2] = points[i].split(",");
      x1 = parseInt(x1);
      y1 = parseInt(y1);
      x2 = parseInt(x2);
      y2 = parseInt(y2);
      if (x1 == x2) {
        for (let j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) {
          map[`${x1},${j}`] = "#";
        }
      } else if (y1 == y2) {
        for (let j = Math.min(x1, x2); j <= Math.max(x1, x2); j++) {
          map[`${j},${y1}`] = "#";
        }
      }
      x1 = x2;
      y1 = y2;
    }
  });
  return map;
}

function addFloor(map) {
  for (let i = maxY + 1; i <= maxY + 2; i++) {
    for (let j = minX - 1; j <= maxX + 1; j++) {
      if (i >= 0 && j >= 0) {
        if (i === maxY + 1) {
          map[`${j},${i}`] = ".";
        } else if (i === maxY + 2) {
          map[`${j},${i}`] = "#";
        }
      }
    }
  }
  maxY += 2;
  return map;
}

function makeColumn(map, xCol) {
  let newX = parseInt(xCol);
  for (let i = 0; i < maxY; i++) {
    if (i >= 0 && newX >= 0) {
      map[`${newX},${i}`] = ".";
    }
  }
  map[`${newX},${maxY}`] = "#";
  if (newX < minX) {
    minX -= 1;
  }
  if (newX > maxX) {
    maxX += 1;
  }
  return map;
}

function dropSand(map, fromX, fromY) {
  let sandX = parseInt(fromX);
  let sandY = parseInt(fromY);
  let sandSettled = false;

  while (!sandSettled && sandY <= maxY) {
    if (map[`${sandX},${sandY + 1}`] === ".") {
      sandY++;
    } else {
      if (map[`${sandX - 1},${sandY + 1}`] === ".") {
        sandX--;
        sandY++;
      } else if (map[`${sandX + 1},${sandY + 1}`] === ".") {
        sandX++;
        sandY++;
      } else {
        sandSettled = true;
        if (sandY <= maxY) {
          map[`${sandX},${sandY}`] = "o";
        }
      }
    }

    if (sandX === minX) {
      map = makeColumn(map, sandX - 1);
    }
    if (sandX === maxX) {
      map = makeColumn(map, sandX + 1);
    }
  }
  return [map, sandY <= maxY, sandX, sandY];
}

let data = fs.readFileSync(filename, "utf8");
let walls = data.split("\n");

let maxX = -Infinity;
let minX = Infinity;
let maxY = -Infinity;

getBounds(walls);

let map = makeMap(maxX, minX, maxY);

map = addWalls(map, walls);

let sandStayed = true;
let sandCount = 0;

while (sandStayed) {
  [map, sandStayed, _, _] = dropSand(map, 500, 0);
  if (sandStayed === true) sandCount++;
}

console.log(`Part 1: ${sandCount}`);

// Part 2

let map2 = makeMap(maxX, minX, maxY);
map2 = addWalls(map2, walls);
map2 = addFloor(map2);

let sandCount2 = 0;
sandX = 0;
sandY = 0;

while (sandX !== 500 || sandY !== 0) {
  [map2, sandStayed2, sandX, sandY] = dropSand(map2, 500, 0);
  if (sandStayed2 === true) sandCount2++;
}

console.log(`Part 2: ${sandCount2}`);

console.timeEnd("time");
