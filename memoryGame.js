"use strict";

class Game {
  constructor(items) {
    this.items = items;
    this.board = document.getElementById("board");
    this.counter = 0;
    this.disable = true;
    this.matchesMade = 0;
    this.possibleMatches = this.items.length / 2;
    this.musicPlaying = false;
    this.firstSelection = "";
    this.secondSelection = "";
  }

  /** Return a shuffled array of items using Fisher-Yates shuffle.  */
  shuffle() {
    return _.shuffle(this.items);
  }

  /** Create a card for each item, and append the board. */
  createCards() {

    for (let item of this.items) {
      let curCard = document.createElement("div");
      curCard.classList.add(item, "aCard", "front");
      this.board.append(curCard);
      curCard.addEventListener("click", handleCardClick);
    }
  }

  playMatch() {
    let audio = new Audio("Assets/match.mp3");
    audio.loop = false;
    audio.play();
  }

  flipCard(e) {
    let curCard = e.target;
    let curSrc = `url(${curCard.classList[0]})`;

    if (!this.disable) {
      this.moves += 1;
      // remove front css + add clicked css
      if (curCard.classList.contains("front")) {
        curCard.classList.remove("front");
        curCard.classList.add("clicked");
        curCard.style.backgroundImage = curSrc;
      }
      // if first selection, assign it and increment counter
      if (this.counter === 0) {
        firstSelection = curSrc;
        this.counter += 1;
      } else {
        // if it is the second selection, assign it and set counter to 0;
        this.secondSelection = curSrc;
        this.counter += 1;
      }

      // this makes it so you cannot click a card twice and register a match
      curCard.removeEventListener("click", handleCardClick);

      // if they are matched, add matched, removed clicked
      if (this.firstSelection === this.secondSelection) {
        playMatch();
        let matches = document.querySelectorAll(".clicked");
        this.matchesMade += 1;
        document.querySelector(
          "#current-score"
        ).innerText = `Your Score: ${matchesMade}`;
        for (let match of matches) {
          match.classList.add("matched");
          match.style.backgroundImage = curSrc;
          match.classList.remove("clicked");
          match.removeEventListener("click", handleCardClick);
        }
        //reset counter and selections during match sequence
        this.counter = 0;
        this.firstSelection = this.secondSelection = "";
        // if its end of game
        if (this.possibleMatches === this.matchesMade) {
          playWin();
          return endGame();
        }
      }
      // if it is not a match, and counter is 2, reset selections, reset counter, disable the board, and unflip cards.
      if (this.counter === 2) {
        this.firstSelection = this.secondSelection = "";
        this.counter = 0;
        this.disable = true;
        unFlipCard(e);
      }
    }
  }

  unFlipCard() {
    const noMatch = document.querySelectorAll(".clicked");
    // remove matches after 750ms, shake for 500ms, and re-add the event handler
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
}
