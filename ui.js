"use strict";

const BASE_URL = "https://rickandmortyapi.com/api/character";
const MAX = 150;
const MIN = 1;
const DEFAULT_MATCHES = 2;

const $START_BUTTON = $("#start");
const $GAME_BOARD = $("#game");
const $TIME_DISPLAY = $("#timer-display");
const $TOP_SCORE = $("#high-score")
const $CURRENT_SCORE = $("#current-score");

let deck;

function startGame() {
  $START_BUTTON.off();
  createBoard();

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
    $GAME_BOARD.append(curCard);
    curCard.addEventListener("click", handleClick);
  }
}

function handleClick(evt) {
  evt.preventDefault();

  if (!deck.disable && evt.target.classList[2] === "front") {
    deck.flipCard(evt.target);
  }
  if (deck.flipped === 2) {
    deck.disable = true;
    checkMatch();
  }
  if (deck.matches === DEFAULT_MATCHES) {
    endGame()
  }
}

function checkMatch() {
  let $matches = $(".clicked");
  if (deck.first === deck.second) {
    deck.matches += 1;
    $CURRENT_SCORE.text = `Your Matches: ${deck.matches}`;
    for (let match of $matches) {
      match.classList.add("matched");
      match.classList.remove("clicked");
      match.removeEventListener("click", handleClick);
    }
  } else {
    setTimeout(() => {
      for (let match of $matches) {
        deck.unflipCard(match)
      }
    }, 750);
  }
  deck.flipped = 0;
  deck.first = deck.second = ""
  deck.disable = false;
}

function endGame() {
  if ($TOP_SCORE.text === "High Score: 0") $TOP_SCORE.text(`High Score: ${game.matches} in 10s`);
  $CURRENT_SCORE.text === "Matches Made: 0";
  $GAME_BOARD.empty();
  $START_BUTTON.addClass("retry");
  $START_BUTTON.text("👹TRY AGAIN?👹");
  $("#wrapper").addClass("hidden");
  $START_BUTTON.on("click", startGame);
}
// function startTimer() {
//   let timer = new Timer($START_BUTTON, $TIME_DISPLAY);
//   timer.startTimer()
// }

$START_BUTTON.on("click", startGame);
