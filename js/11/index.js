const fs = require("fs");
const filename = "input.txt";
console.time("time");

class Monkey {
  inspectedItemCount = 0;

  constructor(name, items, operation, divisor, test) {
    this.name = name;
    this.items = items;
    this.operation = operation;
    this.divisor = divisor;
    this.test = test;
  }
}

function runOperation(old, operation) {
  operation = operation.replaceAll("old", old);
  operation = operation.split(" ");
  switch (operation[1]) {
    case "+":
      return parseInt(operation[0]) + parseInt(operation[2]);
    case "*":
      return parseInt(operation[0]) * parseInt(operation[2]);
  }
}

function getM(monkies) {
  let m = 1;
  for (let i = 0; i < monkies.length; i++) {
    m *= monkies[i].divisor;
  }
  return m;
}

function parseMonkies(monkiesRaw) {
  let monkies = [];
  for (let i = 0; i < monkiesRaw.length; i++) {
    let [name, startingItems, operation, test, truth, falsey] = monkiesRaw[i];

    name = name.replace(":", "");
    name = name.replace("Monkey ", "");

    startingItems = startingItems
      .replace("  Starting items: ", "")
      .split(", ")
      .map((item) => parseInt(item));

    operation = operation.replace("  Operation: new = ", "");

    let testValue = parseInt(test.replace("  Test: divisible by ", ""));

    truth = truth.replace("    If true: throw to monkey ", "");
    falsey = falsey.replace("    If false: throw to monkey ", "");

    monkies.push(
      new Monkey(name, startingItems, operation, testValue, function (value) {
        if (value % testValue === 0) {
          return truth;
        }
        return falsey;
      })
    );
  }
  return monkies;
}

function getMonkeyWithName(monkies, name) {
  for (let i = 0; i < monkies.length; i++) {
    if (monkies[i].name === name) {
      return monkies[i];
    }
  }
}

function performRound(monkies, withRelief, m) {
  for (let i = 0; i < monkies.length; i++) {
    let monkey = monkies[i];
    for (let j = 0; j < monkey.items.length; j++) {
      monkey.inspectedItemCount += 1;
      let item = monkey.items[j];
      item = runOperation(item, monkey.operation);
      if (withRelief) {
        item = Math.floor(item / 3);
      } else {
        item = item % m;
      }
      let targetMonkey = monkey.test(item);

      getMonkeyWithName(monkies, targetMonkey).items.push(item);
    }
    monkey.items = [];
  }
}

function getMonkeyBusiness(monkies) {
  let highest = 0;
  let nextHeighest = 0;
  for (let i = 0; i < monkies.length; i++) {
    if (monkies[i].inspectedItemCount > highest) {
      highest = monkies[i].inspectedItemCount;
    }
  }
  for (let i = 0; i < monkies.length; i++) {
    if (
      monkies[i].inspectedItemCount > nextHeighest &&
      monkies[i].inspectedItemCount !== highest
    ) {
      nextHeighest = monkies[i].inspectedItemCount;
    }
  }
  return highest * nextHeighest;
}

function performRounds(monkies, num, withRelief, m) {
  for (let i = 0; i < num; i++) {
    performRound(monkies, withRelief, m);
  }
}

let monkiesRaw = fs
  .readFileSync(filename, "utf8")
  .split("\n\n")
  .map((rawMonkey) => {
    return rawMonkey.split("\n");
  });

let p1Monkies = parseMonkies(monkiesRaw);
performRounds(p1Monkies, 20, true);

console.log(`Part 1: ${getMonkeyBusiness(p1Monkies)}`);

// Part 2

let p2Monkies = parseMonkies(monkiesRaw);
let m = getM(p2Monkies);
performRounds(p2Monkies, 10000, false, m);

console.log(`Part 2: ${getMonkeyBusiness(p2Monkies)}`);

console.timeEnd("time");
