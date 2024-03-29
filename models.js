"use strict";

/** Game Class: Manages game construction and progress.
 *
 *  Game will have:
 *  - size: int
 *  - deck: object
 *  - disable: boolean
 *  - matches: int
 *  - moves: int
 *  - flipped: int
 *  - first: str
 *  - second: str
 */
class Game {
  constructor(size) {
    /** Construct each Game instance from:
     *  - size: integer
     *  - deck: array of images
     */
    try {
      Number(size);
    } catch (e) {
      console.error("Enter a valid number");
    }
    this.size = Math.floor(size);
    this.deck = {};
    this.disable = false;
    this.matches = 0;
    this.moves = 0;
    this.flipped = 0;
    this.first = "";
    this.second = "";
  }
  /* Get's items from the Pexel's API, trims and shuffles, then sends to the deck */
  async getItems() {
    try {
      const response = await axios.get(
        `${BASE_URL}search?query=scary&orientation=square&size=small/`,
        {
          headers: {
            authorization:
            // stash in secret.js
              "Gj6KkQT6GehhX2NdAp9Ee0I3gZOFdqj2EPkkubEFnEwu7qet6SW6WXE3",
          },
        }
      );

      let formattedCards = [];

      for (let item of response.data.photos) {
        if (item.src.medium) {
          const image = item.src.medium;
          formattedCards.push({ id: item.id, image: image });
        }
      }
      // shuffle the result randomly using lodash's sampleSize
      formattedCards = _.sampleSize(formattedCards, this.size);
      // iterate over the results and populate the deck
      formattedCards.forEach((item) => (this.deck[item.id] = item.image));
    } catch (e) {
      console.error(e);
    }
  }

  /** Handles flipping of card. */
  flipCard(card) {
      if (card.classList?.contains("front")) {
        card.classList.remove("front");
        card.classList.add("clicked");
        card.style.backgroundImage = `url(${this.deck[card.classList[0]]})`;
        card.removeEventListener("click", this.flipCard);
        if (!this.first) {
          this.first = card.classList[0];
        } else if (!this.second) {
          this.second = card.classList[0];
        }
      }
      this.moves += 1;
      this.flipped += 1;
  }

  /** Handles un-flipping of card. */
  unflipCard(card) {
    card.classList.remove("clicked");
    card.classList.add("shake");
    card.style.removeProperty("background-image");
    card.classList.add("front");
    setTimeout(() => {
      card.classList.remove("shake");
      card.addEventListener("click", this.flipCard);
    }, 500);
    this.disable = false;
  }
}

/** Timer class measures time in seconds. Seconds were used due to simplicity and need.
 *
 * Timer will take:
 *  - timerText: jQuery Timer element
 */
class Timer {
  constructor(timerText) {
    this.timerText = timerText;
    this.seconds = 0;
    this.int = null;
  }

  startTimer() {
    this.int = setInterval(this.displayTimer.bind(this), 1000);
  }

  resetTimer() {
    clearInterval(this.int);
    this.seconds = 0;
  }

  displayTimer() {
    this.seconds++;
    this.seconds < 10
      ? this.timerText.text(`:0${this.seconds}`)
      : this.timerText.text(`:${this.seconds}`);
  }
}

/** SoundFX holds sounds for various game actions.
 *
 * Sound will take
 * - bgMusic: mp3 (long)
 * - match: mp3 (short)
 * - win: mp3 (short)
 */
class SoundFX {
  constructor(bgMusic, match, win) {
    this.start = bgMusic;
    this.match = match;
    this.win = win;
    this.playing = false;
  }
  playStart() {
    let audioStart = new Audio(this.start);
    audioStart.loop = true;
    audioStart.volume = 0.4;
    audioStart.play();
    this.playing = true;
  }
  playMatch() {
    let audio = new Audio(this.match);
    audio.loop = false;
    audio.play();
  }
  playWin() {
    let audioWin = new Audio(this.win);
    audioWin.loop = false;
    audioWin.volume = 0.2;
    audioWin.play();
  }
}
