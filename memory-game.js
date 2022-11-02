"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */
const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
];

const colors = shuffle(COLORS);
createCards(colors);

/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */
function createCards(colors) {
  const gameBoard = document.getElementById("game");
  let cardId = 1;

  for (let color of colors) {
    let thisCard = document.createElement("div");
    thisCard.classList.add(color, "aCard", "front");
    thisCard.setAttribute("id", cardId);
    gameBoard.append(thisCard);
    thisCard.addEventListener("click", handleCardClick);
    cardId++;
  }
}

let counter = 0;
let firstSelection, secondSelection;
let disable = true;
let moves = 0;
let matchesMade = 0;
let possibleMatches = COLORS.length / 2;
startTimer();

/** Flip a card face-up. */
function flipCard(event) {
  let curCard = event.target;
  let curColor = curCard.classList[0];

  if (!disable) {
    moves++;
    console.log(moves);
    // remove front css + add clicked css
    if (curCard.classList.contains("front")) {
      curCard.classList.remove("front");
      curCard.classList.add("clicked");
      curCard.style.backgroundColor = curColor;
    }
    // if first selection, assign it and increment counter
    if (counter === 0) {
      firstSelection = curColor;
      counter++;
    } else {
      // if it is the second selection, assign it and set counter to 0;
      secondSelection = curColor;
      counter++;
    }
    // this makes it so you cannot click a card twice and register a match
    curCard.removeEventListener("click", handleCardClick);

    // if they are matched, add matched, keep bg color, removed clicked
    if (firstSelection === secondSelection) {
      let matches = document.querySelectorAll(".clicked");
      matchesMade++;
      console.log({ matchesMade });
      for (let match of matches) {
        match.classList.add("matched");
        match.style.backgroundColor = curColor;
        match.classList.remove("clicked");
        match.removeEventListener("click", handleCardClick);
      }
      //reset counter and selections during match sequence
      counter = 0;
      firstSelection = "";
      secondSelection = "";
      // if its end of game
      if (possibleMatches === matchesMade) {
        return endGame();
      }
    }
    if (counter === 2) {
      firstSelection = secondSelection = "";
      counter = 0;
      disable = true;
      unFlipCard(event);
    }
  }
}

/** Flip a card face-down. */
function unFlipCard() {
  const noMatch = document.querySelectorAll(".clicked");
  // remove matches after 1500ms
  setTimeout(() => {
    for (let incorrect of noMatch) {
      incorrect.classList.remove("clicked");
      incorrect.classList.add("shake");
      incorrect.style.removeProperty("background-color");
      incorrect.classList.add("front");
      setTimeout(() => {
        incorrect.classList.remove("shake");
        incorrect.addEventListener("click", handleCardClick);
      }, 500);
      disable = false;
    }
  }, 750);
}

// what happens at the end?
function endGame() {
  pauseTime();
  let curScore = document.querySelector("#timer-display").innerText;
  let topScore = document.querySelector("#high-score");
  if (curScore === "0:00") topScore.innerText = curScore;
}
/** Handle clicking on a card: this could be first-card or second-card. */
function handleCardClick(event) {
  flipCard(event);
}

//timer variables
const timeText = document.getElementById("timer-display");
const startBtn = document.querySelector("#start");
let [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
let int = null;

function startTimer() {
  disable = false;
  document.querySelector("#start").addEventListener("click", () => {
    if (int !== null) {
      clearInterval(int);
    }
    int = setInterval(displayTimer, 10);
  });
}

function pauseTime() {
  clearInterval(int);
}

function resetTimer() {
  clearInterval(int);
  [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
  timeText.innerHTML = "00 : 00 ";
  startBtn.removeEventListener();
}

function displayTimer() {
  milliseconds += 10;
  if (milliseconds == 1000) {
    milliseconds = 0;
    seconds++;
    if (seconds == 60) {
      seconds = 0;
      minutes++;
      if (minutes == 60) {
        minutes = 0;
        hours++;
      }
    }
  }
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;
  timeText.innerHTML = `${m}:${s}`;
}
