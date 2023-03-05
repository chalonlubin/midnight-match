class Game {
  constructor(size) {
    /** Construct each Game instance from:
     *  - size: integer
     *  - deck: array of images
     */
    try {
      Number(size)
    } catch(e){
      console.error("Enter a valid number");
    }
    this.size = Math.floor(size);
    this.deck = {};
    this.disable = false;
    this.matches = 0
    this.moves = 0;
    this.flipped = 0;
    this.first = ""
    this.second = ""
  }

  /** Creates an array of count length containing randomly generated values.  */
  generateArray() {
    return Array.from({ length: this.size }, () => _.random(MIN, MAX));
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

  flipCard(card) {
    if (card.classList.contains("front")) {
      card.classList.remove("front");
      card.classList.add("clicked");
      card.style.backgroundImage = `url(${this.deck[card.classList[0]]})`;
      card.removeEventListener("click", this.flipCard);
      if (!this.first) {
        this.first = card.classList[0]
      } else if (!this.second) {
        this.second = deck.flipCard(evt.target)
      }
    }
    this.moves += 1;
    this.flipped += 1;
    }
  }

  unflipCard(card) {
    card.classList.remove("clicked");
    card.classList.add("shake");
    card.style.removeProperty("background-image");
    card.classList.add("front");
    setTimeout(() => {
      card.classList.remove("shake");
      card.addEventListener("click", this.flipCard);
    }, 500);
    // this.disable = false;
  }
}

class Timer {
  constructor(startBtn, timerText) {
    this.startBtn = startBtn;
    this.timerText = timerText;
    this.int = null;
    this.milliseconds = 0, this.seconds = 0, this.minutes = 0, this.hours = 0;
  }

//   startTimer() {
//     this.startBtn.addEventListener("click", () => {
//       if (this.int !== 0) {
//         clearInterval(this.int);
//       }
//       this.int = setInterval(this.displayTimer, 10);
//       this.startBtn.classList.remove("retry");
//       this.startBtn.classList.remove("hidden");
//       // disable = false;
//       // if (musicPlaying === false) playStart();
//     });
//   }

//   resetTimer() {
//     clearInterval(this.int);
//     [this.milliseconds, this.seconds, this.minutes] = [0, 0, 0];
//     this.timerText.innerHTML = "00 : 00 ";
//   }

//   displayTimer() {
//     this.milliseconds += 10;
//     if (this.milliseconds == 1000) {
//       this.milliseconds = 0;
//       this.seconds++;
//       if (this.seconds == 60) {
//         this.seconds = 0;
//         this.minutes++;
//         if (this.minutes == 60) {
//           this.minutes = 0;
//           this.hours++;
//         }
//       }
//     }

//     let m = this.minutes < 10 ? "0" + this.minutes : this.minutes;
//     let s = this.seconds < 10 ? "0" + this.seconds : this.seconds;
//     this.timerText.innerHTML = `${m}:${s}`;
//   }
// }

class Effect {
  constructor(start, match, win) {
    this.start = start;
    this.match = match;
    this.win = win;
  }
  playStart() {
    let audioStart = new Audio(this.start);
    audioStart.loop = true;
    audioStart.volume = 0.2;
    audioStart.play();
  }
  playMatch() {
    let audio = new Audio(this.match);
    audio.loop = false;
    audio.play();
  }
  playWin() {
    let audioWin = new Audio(this.win);
    audioWin.loop = false;
    audioWin.volume = 0.5;
    audioWin.play();
  }
}
