const fs = require("fs");

const filename = "input.txt";

let input = fs.readFileSync(filename, "utf8").split("");

function getStartOfPacketMarker(input) {
  return charactersProcessedBeforeFirstXUniqueCharacters(4, input);
}
function getStartOfMessageMarker(input) {
  return charactersProcessedBeforeFirstXUniqueCharacters(14, input);
}

function charactersProcessedBeforeFirstXUniqueCharacters(x, given) {
  return (
    given.findIndex((_, index) => {
      let internalArr = [];
      for (let j = 0; j < x; j++) {
        internalArr.push(input[index + j]);
      }

      if (internalArr.includes(undefined)) {
        return false;
      }

      let filtered = internalArr.filter((v, i, s) => {
        return s.indexOf(v) === i;
      });

      if (filtered.length === x) {
        return true;
      }
    }) + x
  );
}

console.log(`Part 1: ${getStartOfPacketMarker(input)}`);

// Part 2

console.log(`Part 2: ${getStartOfMessageMarker(input)}`);
