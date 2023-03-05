"use strict";

const BASE_URL = "https://rickandmortyapi.com/api/character";
const MAX = 150;
const MIN = 1;
const DEFAULT_MATCHES = 8;

const $START_BUTTON = $("#start");
const $GAMEBOARD = $("#game");
const $TIME_DISPLAY = $("#timer-display");

let deck;

function startGame() {
  createBoard();
  // start the time
}

async function createBoard() {
  deck = new Game(DEFAULT_MATCHES);
  await deck.getItems();
  let names = [];

  for (let item in deck.deck) {
    names.push(item);
    names.push(item);
  }
  names = _.shuffle(names);

  for (let name of names) {
    let curCard = document.createElement("div");
    curCard.classList.add(name, "aCard", "front");
    $GAMEBOARD.append(curCard);
    curCard.addEventListener("click", handleClick);
  }
}

function handleClick(evt) {
  evt.preventDefault();

  if (!deck.disable && curCard.classList[2] === "front") {
    deck.flipCard(evt.target);
  }
  if (deck.flipped === 2) {
    checkMatch();
  }
}

function checkMatch() {
  let $matches = $(".clicked");
  if (deck.first === deck.second) {
    deck.matches += 1;
    document.querySelector(
      "#current-score"
    ).innerText = `Your Matches: ${deck.matches}`;
    for (let match of $matches) {
      match.classList.add("matched");
      match.classList.remove("clicked");
      match.removeEventListener("click", handleClick);
    }
  } else {
    $matches.forEach(match => deck.unflipCard(match))
  }
}

// function startTimer() {
//   let timer = new Timer($START_BUTTON, $TIME_DISPLAY);
//   timer.startTimer()
// }

$START_BUTTON.on("click", startGame);
