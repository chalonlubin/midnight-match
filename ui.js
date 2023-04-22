"use strict";

/* Global ********************************************************************/
const BASE_URL = "https://api.pexels.com/v1/";
const DEFAULTS = {
  min: 1,
  max: 100,
  choices: 6,
  bgMusic: "Assets/bg-music.mp3",
  matchSound: "Assets/match.mp3",
  winSound: "Assets/Victory.mp3",
};

/* min-max refers to the range of API id's you'd like to get, more common characters live in the lower ranges while rarer characters live in the higher id number ranges. */

/* Game Elements */
const $HEADER = $(".header");
const $GAME_AREA = $("#game");
const $CARD_AREA = $("#cards");
const $PLAY_BUTTON = $("#play");

/* Footer Elements */
const $TIMER = $("#timer-display");
const $TOP_SCORE = $("#high-score");
const $TIMER_SCORE = $("#time");
const $CURRENT_SCORE = $("#current-score");

/* Game Functionality ******************************************************* */
let deck, sound;
let timer = new Timer($TIMER);

/**
 * startGame: handles the actions required to start the game
 * - removes the event listener on the play button.
 * - populates the board with cards based on how many matches are
 *   fed as the default.
 * - hides the header for a more friendly user experience.
 */
function startGame() {
  $PLAY_BUTTON.off();
  $GAME_AREA.show();
  $HEADER.hide();
  createBoard();
  timer.startTimer();
}

/** createBoard: Creates a new game board with shuffled cards. */
async function createBoard() {
  const { choices, bgMusic, matchSound, winSound } = DEFAULTS;
  let names = [];

  deck = new Game(choices);
  await deck.getItems();
  for (let item in deck.deck) {
    names.push(item);
    names.push(item);
  }
  names = _.shuffle(names);
  for (let name of names) {
    let curCard = document.createElement("div");
    curCard.classList.add(name, "aCard", "front");
    $CARD_AREA.append(curCard);
    curCard.addEventListener("click", handleClick);
  }

  if (!(sound instanceof SoundFX)) {
    sound = new SoundFX(bgMusic, matchSound, winSound);
    if (!sound.playing) sound.playStart();
  }
}

/** handleClick: Handles card clicks pertaining to the current
 * state of the deck.
 */
function handleClick(evt) {
  evt.preventDefault();

  if (deck.disable === false && evt.target.classList[2] === "front") {
    deck.flipCard(evt.target);
  }
  if (deck.disable === false && deck.flipped === 2) {
    deck.disable = true;
    checkMatch();
  }
  if (deck.matches === DEFAULTS.choices) {
    sound.playWin();
    endGame();
  }
}

/** checkMatch: If two cards are "flipped" checkMatch will resolve whether or not
 * they are matched and implement the actions needed to move forward.
 * */
function checkMatch() {
  let $matches = $(".clicked");
  if (deck.first === deck.second) {
    sound.playMatch();
    deck.matches += 1;
    $CURRENT_SCORE.text(`${deck.matches}`);
    for (let match of $matches) {
      match.classList.add("matched");
      match.classList.remove("clicked");
      match.removeEventListener("click", handleClick);
    }
    deck.disable = false;
  } else {
    setTimeout(() => {
      for (let match of $matches) {
        deck.unflipCard(match);
      }
      deck.disable = false;
    }, 750);
  }

  deck.flipped = 0;
  deck.first = deck.second = "";
}

/** endGame: terminates current game session, populates the high score if needed,
 *  and presents a retry button that will restart the game rendering process. */
function endGame() {
  if ($TOP_SCORE.text() === "0" || $TIMER_SCORE.text() > $TIMER.text()) {
    $TIMER_SCORE.text(`${$TIMER.text()}`);
    $TOP_SCORE.text(`${deck.matches}`);
  }
  $CURRENT_SCORE.text === "0";
  $CARD_AREA.empty();
  $HEADER.show();
  timer.resetTimer();
  $PLAY_BUTTON.addClass("retry").text("👹TRY AGAIN?👹").on("click", startGame);
}

$PLAY_BUTTON.on("click", startGame);
$GAME_AREA.hide();
