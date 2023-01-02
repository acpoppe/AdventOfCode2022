const fs = require("fs");
const filename = "input.txt";
console.time("time");

function isOnSurface(x, y, z) {
  let queue = [{ x, y, z }];
  let checked = new Set();

  while (queue.length > 0) {
    checking = queue.pop();
    if (checked.has(`${checking.x},${checking.y},${checking.z}`)) {
      continue;
    }
    checked.add(`${checking.x},${checking.y},${checking.z}`);
    let found = false;
    for (let i = 0; i < cubes.length; i++) {
      if (
        cubes[i].x === checking.x &&
        cubes[i].y === checking.y &&
        cubes[i].z === checking.z
      ) {
        found = true;
        break;
      }
    }
    if (found) continue;
    if (
      checking.x < minX ||
      checking.x > maxX ||
      checking.y < minY ||
      checking.y > maxY ||
      checking.z < minZ ||
      checking.z > maxZ
    ) {
      return true;
    }
    for (let i = 0; i < offsets.length; i++) {
      let offset = offsets[i];
      queue.push({
        x: checking.x + offset.x,
        y: checking.y + offset.y,
        z: checking.z + offset.z,
      });
    }
  }
  return false;
}

const data = fs.readFileSync(filename, "utf8").split("\n");
let cubes = data.map((cube) => {
  let [x, y, z] = cube.split(",");
  return { x: parseInt(x), y: parseInt(y), z: parseInt(z) };
});

let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
let minZ = Infinity;
let maxZ = -Infinity;
for (let i = 0; i < cubes.length; i++) {
  minX = Math.min(minX, cubes[i].x);
  maxX = Math.max(maxX, cubes[i].x);
  minY = Math.min(minY, cubes[i].y);
  maxY = Math.max(maxY, cubes[i].y);
  minZ = Math.min(minZ, cubes[i].z);
  maxZ = Math.max(maxZ, cubes[i].z);
}

let total = 0;
let total2 = 0;
const offsets = [
  { x: -1, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: 0, z: -1 },
  { x: 0, y: 0, z: 1 },
];
for (let i = 0; i < cubes.length; i++) {
  for (let j = 0; j < offsets.length; j++) {
    let cube = cubes[i];
    let offset = offsets[j];
    let found = false;
    for (let k = 0; k < cubes.length; k++) {
      if (k !== i) {
        let other = cubes[k];
        if (
          cube.x + offset.x === other.x &&
          cube.y + offset.y === other.y &&
          cube.z + offset.z === other.z
        ) {
          found = true;
          break;
        }
      }
    }
    if (!found) {
      total++;
      if (
        isOnSurface(cube.x + offset.x, cube.y + offset.y, cube.z + offset.z)
      ) {
        total2++;
      }
    }
  }
}

console.log(`Part 1: ${total}`);
console.log(`Part 2: ${total2}`);
console.timeEnd("time");
