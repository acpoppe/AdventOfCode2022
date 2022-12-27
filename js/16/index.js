const fs = require("fs");
const filename = "input.txt";

let solveCache = new Map();
let secondCache = new Map();

function solve(fromValve, time, openedValves, elephantHelp = false) {
  openedValves.sort();
  if (time === 0) {
    if (elephantHelp) {
      return solve(data["AA"], 26, [...openedValves]);
    }
    return 0;
  }

  if (
    solveCache.has(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`
    )
  ) {
    return solveCache.get(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`
    );
  }

  if (
    secondCache.has(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`
    )
  ) {
    return secondCache.get(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`
    );
  }

  let score = 0;

  for (let i = 0; i < fromValve.connections.length; i++) {
    score = Math.max(
      score,
      solve(
        data[fromValve.connections[i]],
        time - 1,
        [...openedValves],
        elephantHelp
      )
    );
  }

  if (fromValve.flowRate > 0 && !openedValves.includes(fromValve.name)) {
    score = Math.max(
      score,
      (time - 1) * fromValve.flowRate +
        solve(
          fromValve,
          time - 1,
          [fromValve.name, ...openedValves],
          elephantHelp
        )
    );
  }
  if (
    !solveCache.has(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`
    ) &&
    !secondCache.has(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`
    ) &&
    solveCache.size < 16000000
  ) {
    solveCache.set(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`,
      score
    );
  } else if (
    !solveCache.has(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`
    ) &&
    !secondCache.has(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`
    ) &&
    solveCache.size >= 16000000
  ) {
    secondCache.set(
      `${fromValve.name}-${time}-${openedValves.join(",")}-${elephantHelp}`,
      score
    );
  }
  return score;
}

let data = [];

fs.readFileSync(filename, "utf8")
  .split("\n")
  .map((line) => {
    let parts = line.split(" ");
    //Valve IZ has flow rate=20; tunnels lead to valves LY, XC

    data[parts[1]] = {
      name: parts[1],
      flowRate: parseInt(parts[4].substring(5).replace(";", "")),
      connections: parts.slice(9).map((x) => x.replace(",", "")),
    };
  });

console.log(`Part 1: ${solve(data["AA"], 30, [])}`);

solveCache = new Map();
secondCache = new Map();
console.log(`Part 2: ${solve(data["AA"], 26, [], true)}`);
