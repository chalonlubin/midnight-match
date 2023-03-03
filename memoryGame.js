"use strict";

class MemoryGame {
  constructor(items) {
    this.items = _.shuffle(items);
    this.board = document.getElementById("board");
    this.counter = 0;
    this.moves = 0;
    this.matchesMade = 0;
    this.possibleMatches = this.items.length / 2;
    this.musicPlaying = false;
    this.disable = true;
    this.firstSelection = "";
    this.secondSelection = "";
  }

  /** Create a card for each item, and append the board. */
  createCards() {
    for (let item of this.items) {
      let curCard = document.createElement("div");
      curCard.classList.add(item, "aCard", "front");
      this.board.append(curCard);
      curCard.addEventListener("click", this.flipCard);
    }
  }

  playMatch() {
    let audio = new Audio("Assets/match.mp3");
    audio.loop = false;
    audio.play();
  }
  playStart() {
    let audioStart = new Audio("Assets/bg-music.mp3");
    audioStart.loop = true;
    audioStart.volume = 0.2;
    audioStart.play();
    this.musicPlaying = true;
  }
  playWin() {
    let audioWin = new Audio("Assets/Victory.mp3");
    audioWin.loop = false;
    audioWin.volume = 0.5;
    audioWin.play();
  }

  flipCard(e) {
    const curCard = e.target;
    const curSrc = `url(${curCard.classList[0]})`;

    if (this.disable) return;

    this.moves++;

    if (curCard.classList.contains("front")) {
      curCard.classList.replace("front", "clicked");
      curCard.style.backgroundImage = curSrc;
    }

    if (this.counter === 0) {
      this.firstSelection = curSrc;
    } else {
      this.secondSelection = curSrc;
    }
    this.counter++;

    curCard.removeEventListener("click", this.flipCard);

    if (this.firstSelection && this.secondSelection) {
      if (this.firstSelection === this.secondSelection) {
        this.matchCards(curSrc);
      } else {
        this.unmatchCards(curSrc);
      }
    }
  }

  matchCards(curSrc) {
    const matches = document.querySelectorAll(".clicked");
    this.matchesMade++;

    for (let match of matches) {
      match.classList.replace("clicked", "matched");
      match.style.backgroundImage = curSrc;
      match.removeEventListener("click", this.flipCard);
    }

    this.counter = 0;
    this.firstSelection = "";
    this.secondSelection = "";

    if (this.possibleMatches === this.matchesMade) {
      this.playWin();
      this.endGame();
    }
  }

  unmatchCards() {
    this.disable = true;
    const noMatch = document.querySelectorAll(".clicked");

    setTimeout(() => {
      for (let incorrect of noMatch) {
        incorrect.classList.remove("clicked");
        incorrect.classList.add("shake");
        incorrect.style.removeProperty("background-image");
        incorrect.classList.replace("clicked", "front");

        setTimeout(() => {
          incorrect.classList.remove("shake");
          incorrect.addEventListener("click", this.flipCard);
        }, 500);

        this.disable = false;
      }
      this.counter = 0;
      this.firstSelection = "";
      this.secondSelection = "";
    }, 750);
  }

  endGame() {
    // Get the top score and current score elements
    const topScoreElement = document.querySelector("#high-score");
    const currentScoreElement = document.querySelector("#timer-display");

    // Extract the numeric values from the score strings
    const topScore = parseInt(topScoreElement.innerText.replace(/\D/g, ""));
    const currentScore = parseInt(
      currentScoreElement.innerText.replace(/\D/g, "")
    );

    // Pause the game timer
    this.pauseTime();

    // Update the top score if the current score is greater
    if (currentScore > topScore) {
      topScoreElement.innerText = `High Score: ${currentScore}`;
    }

    // Reset the game
    this.resetGame();
  }

  resetGame() {
    // Reset the number of matches made and update the score display
    this.matchesMade = 0;
    document.querySelector("#current-score").innerText = `Your Score: 0`;

    // Reset the game board
    this.resetTimer();
    document.querySelector("#game").replaceChildren();
    this.items = _.shuffle(this.items);
    this.createCards(this.items);

    // Start the game timer and disable clicking until the board is fully reset
    this.startTimer();
    this.disable = true;

    // Update the start button to show "TRY AGAIN?" and hide the game instructions
    document.querySelector("#start").classList.add("retry");
    document.querySelector("#start").innerText = "👹TRY AGAIN?👹";
    document.querySelector(".wrapper").classList.add("hidden");
  }

  startTimer() {
    document.querySelector("#start").addEventListener("click", () => {
      if (this.int !== null) {
        clearInterval(int);
      }
      this.int = setInterval(displayTimer, 10);
      document.querySelector("#start").classList.remove("retry");
      document.querySelector(".wrapper").classList.remove("hidden");
      this.disable = false;
      if (this.musicPlaying === false) this.playStart();
    });
  }

  pauseTime() {
    clearInterval(int);
  }

  resetTimer() {
    clearInterval(int);
    [milliseconds, seconds, minutes] = [0, 0, 0];
    timeText.innerHTML = "00 : 00 ";
  }

  displayTimer() {
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
}
