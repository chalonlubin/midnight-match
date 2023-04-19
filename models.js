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

  /** Creates an array of count length containing randomly generated values.  */
  generateArray() {
    return Array.from({ length: this.size }, () =>
      _.random(DEFAULTS.min, DEFAULTS.max)
    );
  }

  /**
   * Gets images from API to use for card game.
   *
   * Returns: Array of url linking to jpeg images.
   */
  async getItems() {
    try {
      let response = await axios.get(
        `${BASE_URL}/${this.generateArray(this.size / 2)}`
      );
      for (let item of response.data) {
        let { name, image } = item;
        this.deck[_.camelCase(name)] = image;
      }
    } catch (e) {
      console.error(e);
    }
  }

  /** Handles flipping of card. */
  flipCard(card) {
    try {
      if (card.classList.contains("front")) {
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
    } catch (e) {
      console.log("clicking too fast");
    }
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
      : this.timerText.text(`:${this.seconds}`)
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
