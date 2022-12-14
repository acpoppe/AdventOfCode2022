const fs = require("fs");
const filename = "input.txt";

class Node {
  constructor(
    height,
    row,
    col,
    distance = Infinity,
    isStart = false,
    isEnd = false
  ) {
    this.height = height;
    this.row = row;
    this.col = col;
    this.distance = distance;
    this.isStart = isStart;
    this.isEnd = isEnd;
    this.isVisited = false;
    this.previous = null;
  }
}

function compareNode(
  terrain,
  node,
  comparisonNodeRow,
  comparisonNodeCol,
  p2 = false
) {
  if (comparisonNodeRow < 0 || comparisonNodeCol < 0) return undefined;
  if (
    comparisonNodeRow >= terrain.length ||
    comparisonNodeCol >= terrain[0].length
  )
    return undefined;
  let comparisonNode = terrain[comparisonNodeRow][comparisonNodeCol];
  if (comparisonNode === undefined) return undefined;
  if (comparisonNode.isVisited) return undefined;
  if (
    (comparisonNode.height.charCodeAt(0) <= node.height.charCodeAt(0) + 1 &&
      !p2) ||
    (comparisonNode.height.charCodeAt(0) >= node.height.charCodeAt(0) - 1 && p2)
  ) {
    if (comparisonNode.distance > node.distance + 1) {
      comparisonNode.distance = node.distance + 1;
      comparisonNode.previous = node;
    }
    return comparisonNode;
  }
  return undefined;
}

function visitNode(terrain, visitingQueue, node, p2 = false) {
  node.isVisited = true;
  if (node.isEnd && !p2) {
    endVisited = true;
    ending = node;
    return;
  }
  visitingQueue.delete(`${node.row},${node.col}`);

  let topNode = compareNode(terrain, node, node.row - 1, node.col, p2);
  let bottomNode = compareNode(terrain, node, node.row + 1, node.col, p2);
  let leftNode = compareNode(terrain, node, node.row, node.col - 1, p2);
  let rightNode = compareNode(terrain, node, node.row, node.col + 1, p2);

  if (topNode !== undefined)
    visitingQueue.set(`${topNode.row},${topNode.col}`, topNode);
  if (bottomNode !== undefined)
    visitingQueue.set(`${bottomNode.row},${bottomNode.col}`, bottomNode);
  if (leftNode !== undefined)
    visitingQueue.set(`${leftNode.row},${leftNode.col}`, leftNode);
  if (rightNode !== undefined)
    visitingQueue.set(`${rightNode.row},${rightNode.col}`, rightNode);
}

function getMinVisiting(visitingQueue) {
  let minNode;
  visitingQueue.forEach((node) => {
    if (!minNode || minNode.distance > node.distance) {
      minNode = node;
    }
  });
  return minNode;
}

let visitingQueue = new Map();
let starting;
let ending;

const mapRows = fs.readFileSync(filename, "utf8").split("\n");
let terrain = mapRows.map((row, i) =>
  row.split("").map((char, j) => {
    if (char === "S") {
      let node = new Node("a", i, j, 0, true);
      node.isVisited = true;
      starting = node;
      return node;
    }
    if (char === "E") {
      return new Node("z", i, j, Infinity, false, true);
    }
    return new Node(char, i, j);
  })
);

let endVisited = false;

visitNode(terrain, visitingQueue, starting);

while (!endVisited) {
  let visitingNode = getMinVisiting(visitingQueue);
  visitNode(terrain, visitingQueue, visitingNode);
}

console.log(`Part 1: ${ending.distance}`);

// Part 2

function getLeastA() {
  let leastA;
  terrainP2.forEach((row) => {
    row.forEach((node) => {
      if (node.height === "a") {
        if (!leastA || leastA.distance > node.distance) {
          leastA = node;
        }
      }
    });
  });
  return leastA;
}

let endingP2;
let visitingQueueP2 = new Map();

let terrainP2 = mapRows.map((row, i) =>
  row.split("").map((char, j) => {
    if (char === "S") {
      let node = new Node("a", i, j, Infinity);
      return node;
    }
    if (char === "E") {
      let endNode = new Node("z", i, j, 0, true);
      endNode.isVisited;
      endingP2 = endNode;
      return endNode;
    }
    return new Node(char, i, j);
  })
);

visitNode(terrainP2, visitingQueueP2, endingP2, true);

while (visitingQueueP2.size > 0) {
  let visitingNodeP2 = getMinVisiting(visitingQueueP2);
  visitNode(terrainP2, visitingQueueP2, visitingNodeP2, true);
}
console.log(`Part 2: ${getLeastA().distance}`);
