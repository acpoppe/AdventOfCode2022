const fs = require("fs");
const filename = "input.txt";
console.time("time");

function posIsInSensorRange(posX, posY) {
  for (let i = 0; i < sensorData.length; i++) {
    let distance =
      Math.abs(posX - sensorData[i].sensor[0]) +
      Math.abs(posY - sensorData[i].sensor[1]);

    if (distance <= sensorData[i].distance) {
      return true;
    }
  }
  return false;
}

function hasABeacon(posX, posY) {
  for (let i = 0; i < sensorData.length; i++) {
    if (sensorData[i].beacon[0] === posX && sensorData[i].beacon[1] === posY) {
      return true;
    }
  }
  return false;
}

let maxDistance = 0;
let lowestX = 0;
let highestX = 0;

let data = fs
  .readFileSync(filename, "utf8")
  .split("\n")
  .map((line) => {
    return line.split("Sensor at ")[1];
  });

let pointsRaw = data.map((line) => {
  return line.split(": closest beacon is at ");
});

let points = pointsRaw.map((pair) => {
  return pair.map((point) => {
    return point.split(" ");
  });
});

pointsParsed = points.map((pair) => {
  return pair.map((point) => {
    return point.map((coord) => {
      return parseInt(coord.substring(2));
    });
  });
});

let sensorData = pointsParsed.map((pair) => {
  let distance =
    Math.abs(pair[0][0] - pair[1][0]) + Math.abs(pair[0][1] - pair[1][1]);
  if (distance > maxDistance) {
    maxDistance = distance;
  }
  if (pair[0][0] < lowestX) {
    lowestX = pair[0][0];
  }
  if (pair[0][0] > highestX) {
    highestX = pair[0][0];
  }
  return {
    sensor: pair[0],
    beacon: pair[1],
    distance: distance,
  };
});
let total = 0;

for (let x = lowestX - maxDistance; x <= highestX + maxDistance; x++) {
  if (posIsInSensorRange(x, 2000000)) {
    if (!hasABeacon(x, 2000000)) {
      total++;
    }
  }
}
console.log(`Part 1: ${total}`);

const xyMax = 4000000;

outer: for (let j = 0; j < sensorData.length; j++) {
  let distance = sensorData[j].distance + 1;
  for (let xOffset = distance * -1; xOffset <= distance; xOffset++) {
    if (
      sensorData[j].sensor[0] + xOffset < 0 ||
      sensorData[j].sensor[0] + xOffset > xyMax
    )
      continue;
    let upperYOffset = distance - Math.abs(xOffset);
    let lowerYOffset = upperYOffset * -1;

    if (
      !posIsInSensorRange(
        sensorData[j].sensor[0] + xOffset,
        sensorData[j].sensor[1] + upperYOffset
      ) &&
      sensorData[j].sensor[1] + upperYOffset >= 0 &&
      sensorData[j].sensor[1] + upperYOffset <= xyMax
    ) {
      console.log(
        `Part 2: x: ${sensorData[j].sensor[0] + xOffset}, y: ${
          sensorData[j].sensor[1] + upperYOffset
        }, tuning frequency: ${
          (sensorData[j].sensor[0] + xOffset) * xyMax +
          (sensorData[j].sensor[1] + upperYOffset)
        }`
      );
      break outer;
    }

    if (
      !posIsInSensorRange(
        sensorData[j].sensor[0] + xOffset,
        sensorData[j].sensor[1] + lowerYOffset
      ) &&
      sensorData[j].sensor[1] + lowerYOffset >= 0 &&
      sensorData[j].sensor[1] + lowerYOffset <= xyMax
    ) {
      console.log(
        `Part 2: x: ${sensorData[j].sensor[0] + xOffset}, y: ${
          sensorData[j].sensor[1] + lowerYOffset
        }, tuning frequency: ${
          (sensorData[j].sensor[0] + xOffset) * xyMax +
          (sensorData[j].sensor[1] + lowerYOffset)
        }`
      );
      break outer;
    }
  }
}

console.timeEnd("time");
