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
const GIFS =  [
  "Assets/beetlejuice.gif",
  "Assets/halloween-character-gifs-2.webp",
  "Assets/halloween-character-gifs-3.webp",
  "Assets/halloween-character-gifs-4.webp",
  "Assets/halloween-character-gifs-5.webp",
  "Assets/halloween-character-gifs-7.webp",
  "Assets/halloween-character-gifs-6.webp",
  "Assets/beetlejuice.gif",
  "Assets/haloween-clown.gif",
  "Assets/halloween-character-gifs-2.webp",
  "Assets/halloween-character-gifs-3.webp",
  "Assets/halloween-character-gifs-4.webp",
  "Assets/halloween-character-gifs-5.webp",
  "Assets/halloween-character-gifs-7.webp",
  "Assets/halloween-character-gifs-6.webp",
  "Assets/haloween-clown.gif"
]

const gifs = shuffle(GIFS);
createCards(gifs);

/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Card for every color in colors (each will appear twice)**/

function createCards(gifs) {
  const gameBoard = document.getElementById("game");
  for (let gif of gifs) {
    let thisCard = document.createElement("div");
    thisCard.classList.add(gif, "aCard", "front");
    gameBoard.append(thisCard);
    thisCard.addEventListener("click", handleCardClick);
  }
}

let counter = 0;
let firstSelection, secondSelection;
let disable = true;
let moves = 0;
let matchesMade = 0;
let possibleMatches = GIFS.length / 2;

startTimer();

/** Flip a card face-up. */
function flipCard(event) {
  let curCard = event.target;
  let curSrc = `url(${curCard.classList[0]})`;

  if (!disable) {
    moves++;
    // remove front css + add clicked css
  
    if (curCard.classList.contains("front")) {
      curCard.classList.remove("front");
      curCard.classList.add("clicked");
      curCard.style.backgroundImage = curSrc;
    }
    // if first selection, assign it and increment counter
    if (counter === 0) {
      firstSelection = curSrc;
      counter++;
    } else {
      // if it is the second selection, assign it and set counter to 0;
      secondSelection = curSrc;
      counter++;
    }
    // this makes it so you cannot click a card twice and register a match
    curCard.removeEventListener("click", handleCardClick);

    // if they are matched, add matched, keep bg color, removed clicked
    if (firstSelection === secondSelection) {
      let matches = document.querySelectorAll(".clicked");
      matchesMade++;
      document.querySelector("#current-score").innerText = `Your Score: ${matchesMade}`;
      for (let match of matches) {
        match.classList.add("matched");
        match.style.backgroundImage = curSrc;
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
  // remove matches after 750ms
  setTimeout(() => {
    for (let incorrect of noMatch) {
      incorrect.classList.remove("clicked");
      incorrect.classList.add("shake");
      incorrect.style.removeProperty("background-image");
      incorrect.classList.add("front");
      setTimeout(() => {
        incorrect.classList.remove("shake");
        incorrect.addEventListener("click", handleCardClick);
      }, 500);
      disable = false;
    }
  }, 750);
}



// Endgame score variables.

// at end of game TODO: populate high score, create a way to restart game + reshuffle cards
// ideally with a prompt over the game board asking player if they would like to retry
function endGame() {
  let topScore = document.querySelector("#high-score");
  let topScoreNum = document.querySelector("#high-score").innerText.replace(/\D/g, '');
  let curScore = document.querySelector("#timer-display").innerText;
  let curScoreNum = document.querySelector("#timer-display").innerText.replace(/\D/g, '');
  pauseTime();
  if (topScoreNum == 0) topScore.innerText = `High Score: ${curScore}`;
  if (curScoreNum < topScoreNum) topScore.innerText = `High Score: ${curScore}`;
  resetGame();
  // matchesMade = 0;
  // document.querySelector("#current-score").innerText = `Your Score: 0`;
  // resetTimer()
}

function resetGame() {
  matchesMade = 0;
  document.querySelector("#current-score").innerText = `Your Score: 0`;
  resetTimer();
  document.querySelector("#game").replaceChildren();
  gifs;
  createCards(gifs);
  startTimer();
  disable = true;
  document.querySelector("#start").classList.add("retry");
  document.querySelector("#start").innerText = "👹TRY AGAIN?👹";
  
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
  
  document.querySelector("#start").addEventListener("click", () => {
    if (int !== null) {
      clearInterval(int);
    }
    int = setInterval(displayTimer, 10);
    disable = false;
  });
}

function pauseTime() {
  clearInterval(int);
}

function resetTimer() {
  clearInterval(int);
  [milliseconds, seconds, minutes] = [0, 0, 0];
  timeText.innerHTML = "00 : 00 ";
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
