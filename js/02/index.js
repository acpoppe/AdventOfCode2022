const fs = require("fs");

const winPoints = 6;
const drawPoints = 3;
const lossPoints = 0;

const rockPoints = 1;
const paperPoints = 2;
const scissorsPoints = 3;

let filename = "input.txt";

function translateMove(move) {
  switch (move.toLowerCase()) {
    case "a":
    case "x":
      return "rock";
    case "b":
    case "y":
      return "paper";
    case "c":
    case "z":
      return "scissors";
    default:
      throw new Error();
  }
}

function getResultPoints(round) {
  if (round[0].toLowerCase() === round[1].toLowerCase()) {
    return drawPoints;
  }
  switch (round[1].toLowerCase()) {
    case "rock":
      return round[0].toLowerCase() === "scissors" ? winPoints : lossPoints;
    case "paper":
      return round[0].toLowerCase() === "rock" ? winPoints : lossPoints;
    case "scissors":
      return round[0].toLowerCase() === "paper" ? winPoints : lossPoints;
    default:
      throw new Error();
  }
}

function getChoicePoints(round) {
  switch (round[1].toLowerCase()) {
    case "rock":
      return rockPoints;
    case "paper":
      return paperPoints;
    case "scissors":
      return scissorsPoints;
    default:
      throw new Error();
  }
}

function getScore(round) {
  return getResultPoints(round) + getChoicePoints(round);
}

let input = fs.readFileSync(filename, "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  return data;
});

let rounds = input.split("\n");

let splitRounds = rounds.map((round) => {
  return round.split(" ");
});

let convertedRounds = splitRounds.map((round) => {
  return round.map((move) => {
    return translateMove(move);
  });
});

let scores = convertedRounds.map((round) => {
  return getScore(round);
});

let totalScore = scores.reduce((a, b) => a + b, 0);
console.log("Part 1: " + totalScore);

// Part 2

function translateRound(round) {
  let opponentMove = translateMove(round[0]);
  switch (round[1].toLowerCase()) {
    case "x":
      return [opponentMove, "lose"];
    case "y":
      return [opponentMove, "draw"];
    case "z":
      return [opponentMove, "win"];
    default:
      throw new Error();
  }
}

function getOutcomeResultPoints(round) {
  switch (round[1].toLowerCase()) {
    case "win":
      return winPoints;
    case "draw":
      return drawPoints;
    case "lose":
      return lossPoints;
    default:
      throw new Error();
  }
}

function getChoiceFromOutcome(round) {
  if (round[1].toLowerCase() === "draw") {
    return round[0];
  }
  switch (round[0].toLowerCase()) {
    case "rock":
      return round[1].toLowerCase() === "win" ? "paper" : "scissors";
    case "paper":
      return round[1].toLowerCase() === "win" ? "scissors" : "rock";
    case "scissors":
      return round[1].toLowerCase() === "win" ? "rock" : "paper";
    default:
      throw new Error();
  }
}

function getOutcomeChoicePoints(round) {
  return getChoicePoints([round[0], getChoiceFromOutcome(round)]);
}

function getCorrectScore(round) {
  return getOutcomeResultPoints(round) + getOutcomeChoicePoints(round);
}

let outcomeRounds = splitRounds.map((round) => {
  return translateRound(round);
});

let correctScores = outcomeRounds.map((round) => {
  return getCorrectScore(round);
});

let totalCorrectScores = correctScores.reduce((a, b) => a + b, 0);

console.log("Part 2: " + totalCorrectScores);
