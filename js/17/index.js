const fs = require("fs");
const filename = "input.txt";
console.time("time");

class Game {
  constructor(pattern, signatureSize = 100, maxSimHeight = 2000) {
    this.pattern = pattern;
    this.patternIndex = 0;
    this.nextPieceId = 1;
    this.currentPiece = new Piece(0, 3);
    this.rightWall = 7;
    this.height = 0;
    this.settled = [];
    this.signatures = new Map();
    this.piecesDropped = 0;
    this.signatureSize = signatureSize;
    this.maxSimHeight = maxSimHeight;
  }

  advance(byPieces) {
    let dropPieces = Math.min(this.maxSimHeight, byPieces);
    for (let i = 0; i < dropPieces; i++) {
      while (!this.step()) {}
      this.currentPiece = new Piece(this.nextPieceId, this.height + 3);
      this.nextPieceId = (this.nextPieceId + 1) % 5;
      this.piecesDropped++;
      this.addSignature();
    }
    if (dropPieces < byPieces) {
      this.calculateRemainingHeight(byPieces);
    }
  }

  calculateRemainingHeight(desiredPieceCount) {
    let patternKey = this.checkSignature();
    if (patternKey === undefined) {
      return;
    }
    let startingHeight = this.height;
    let [piecesDropped, height] = patternKey.split(",").map((x) => parseInt(x));
    let dp = this.piecesDropped - piecesDropped;
    let dh = this.height - height;
    let remainingPiecesToCalculate = desiredPieceCount - this.piecesDropped;
    let patternIterations = Math.floor(remainingPiecesToCalculate / dp);
    let remainingDropsBeyondPattern = remainingPiecesToCalculate % dp;
    for (let i = 0; i < remainingDropsBeyondPattern; i++) {
      while (!this.step()) {}
      this.currentPiece = new Piece(this.nextPieceId, this.height + 3);
      this.nextPieceId = (this.nextPieceId + 1) % 5;
      this.piecesDropped++;
    }
    this.height =
      startingHeight + patternIterations * dh + (this.height - startingHeight);
  }

  checkSignature() {
    if (this.height < this.signatureSize) {
      return;
    }
    let lastRows = this.settled
      .filter((point) => point.y >= this.height - this.signatureSize)
      .map((point) => {
        return { x: point.x, y: point.y - (this.height - this.signatureSize) };
      });
    lastRows.sort();
    let sig = JSON.stringify(lastRows);
    for (let [key, val] of this.signatures) {
      if (sig === val && key !== `${this.piecesDropped},${this.height}`) {
        return key;
      }
    }
    return;
  }

  addSignature() {
    if (this.height < this.signatureSize) {
      return;
    }
    let lastRows = this.settled
      .filter((point) => point.y >= this.height - this.signatureSize)
      .map((point) => {
        return { x: point.x, y: point.y - (this.height - this.signatureSize) };
      });
    lastRows.sort();
    let sig = JSON.stringify(lastRows);
    this.signatures.set(`${this.piecesDropped},${this.height}`, sig);
  }

  step() {
    this.blow();
    return this.fall();
  }

  blow() {
    if (this.pattern[this.patternIndex] === "<") {
      if (!this.#canBlow()) {
        this.patternIndex = (this.patternIndex + 1) % this.pattern.length;
        return;
      }
      this.currentPiece.move(true, this.rightWall);
    }
    if (this.pattern[this.patternIndex] === ">") {
      if (!this.#canBlow(false)) {
        this.patternIndex = (this.patternIndex + 1) % this.pattern.length;
        return;
      }
      this.currentPiece.move(false, this.rightWall);
    }
    this.patternIndex = (this.patternIndex + 1) % this.pattern.length;
  }

  #canBlow(left = true) {
    for (let i = 0; i < this.currentPiece.points.length; i++) {
      if (left && this.currentPiece.points[i].x === 0) {
        return false;
      }
      if (
        left &&
        this.settled.filter(
          (point) =>
            point.x === this.currentPiece.points[i].x - 1 &&
            point.y === this.currentPiece.points[i].y
        ).length > 0
      ) {
        return false;
      }
      if (!left && this.currentPiece.points[i].x === this.rightWall - 1) {
        return false;
      }
      if (
        !left &&
        this.settled.filter(
          (point) =>
            point.x === this.currentPiece.points[i].x + 1 &&
            point.y === this.currentPiece.points[i].y
        ).length > 0
      ) {
        return false;
      }
    }
    return true;
  }

  fall() {
    if (!this.#canFall()) {
      this.settle();
      return true;
    }
    this.currentPiece.fall();
    return false;
  }

  #canFall() {
    for (let i = 0; i < this.currentPiece.points.length; i++) {
      if (this.currentPiece.points[i].y === 0) {
        return false;
      }
      if (
        this.settled.filter(
          (point) =>
            point.x === this.currentPiece.points[i].x &&
            point.y === this.currentPiece.points[i].y - 1
        ).length > 0
      ) {
        return false;
      }
    }
    return true;
  }

  settle() {
    for (let i = 0; i < this.currentPiece.points.length; i++) {
      this.settled.push(this.currentPiece.points[i]);
    }
    this.height = Math.max(this.currentPiece.getPeakY(), this.height);
  }

  print() {
    const printFromHeight = Math.min(this.height + 7, this.maxSimHeight);
    for (let i = printFromHeight; i >= 0; i--) {
      process.stdout.write("|");
      for (let j = 0; j < this.rightWall; j++) {
        if (
          this.settled.filter((point) => point.x === j && point.y === i)
            .length > 0
        ) {
          process.stdout.write("#");
        } else if (
          this.currentPiece.points.filter(
            (point) => point.x === j && point.y === i
          ).length > 0
        ) {
          process.stdout.write("@");
        } else {
          process.stdout.write(".");
        }
      }
      process.stdout.write("|\n");
    }
    console.log("+-------+");
  }
}

class Piece {
  constructor(pieceTypeId, baseHeight) {
    this.pieceTypeId = pieceTypeId;
    this.baseHeight = baseHeight;
    this.create();
  }

  create() {
    this.points = [];
    switch (this.pieceTypeId) {
      case 0:
        this.createHorizontal();
        break;
      case 1:
        this.createPlus();
        break;
      case 2:
        this.createL();
        break;
      case 3:
        this.createVertical();
        break;
      case 4:
        this.createSquare();
        break;
      default:
        console.log("Unknown piece type: " + this.pieceTypeId);
        process.kill(process.pid, "SIGTERM");
    }
  }

  getPeakY() {
    let peakY = 0;
    for (let i = 0; i < this.points.length; i++) {
      peakY = Math.max(peakY, this.points[i].y + 1);
    }
    return peakY;
  }

  createHorizontal() {
    for (let i = 2; i < 6; i++) {
      this.points.push({ x: i, y: this.baseHeight });
    }
  }

  createPlus() {
    this.points.push({ x: 3, y: this.baseHeight });
    for (let i = 2; i < 5; i++) {
      this.points.push({ x: i, y: this.baseHeight + 1 });
    }
    this.points.push({ x: 3, y: this.baseHeight + 2 });
  }

  createL() {
    for (let i = 2; i < 5; i++) {
      this.points.push({ x: i, y: this.baseHeight });
    }
    this.points.push({ x: 4, y: this.baseHeight + 1 });
    this.points.push({ x: 4, y: this.baseHeight + 2 });
  }

  createVertical() {
    for (let i = 0; i < 4; i++) {
      this.points.push({ x: 2, y: this.baseHeight + i });
    }
  }

  createSquare() {
    for (let i = 2; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        this.points.push({ x: i, y: this.baseHeight + j });
        this.points.push({ x: i, y: this.baseHeight + j });
      }
    }
  }

  move(left = true) {
    for (let i = 0; i < this.points.length; i++) {
      if (left) {
        this.points[i].x--;
      } else {
        this.points[i].x++;
      }
    }
  }

  fall() {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].y--;
    }
  }
}

let data = fs.readFileSync(filename, "utf8").split("");

let game = new Game(data);
game.advance(2022);
console.log(`Part 1: ${game.height}`);

let game2 = new Game(data);
game2.advance(1000000000000);
console.log(`Part 2: ${game2.height}`);
console.timeEnd("time");
