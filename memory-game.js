"use strict";

(function playGame() {
    // GLOBAL VARIABLES //

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
    const GIFS = [
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
        "Assets/haloween-clown.gif",
    ];
    const gifs = shuffle(GIFS);
    createCards(gifs);
    startTimer();

    // handCardClick global variables
    let counter = 0;
    let firstSelection, secondSelection;
    let disable = true;
    let moves = 0;
    let matchesMade = 0;
    let possibleMatches = GIFS.length / 2;
    let musicPlaying = false;

    //timer variables
    const timeText = document.getElementById("timer-display");
    const startBtn = document.querySelector("#start");
    let [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
    let int = null;
    // FUNCTIONS:

    // Sound on event functions
    function playStart() {
        let audioStart = new Audio("Assets/bg-music.mp3");
        audioStart.loop = true;
        audioStart.volume = 0.2;
        audioStart.play();
        musicPlaying = true;
    }

    function playMatch() {
        let audio = new Audio("Assets/match.mp3");
        audio.loop = false;
        audio.play();
    }
    function playWin() {
        let audioWin = new Audio("Assets/Victory.mp3");
        audioWin.loop = false;
        audioWin.volume = 0.5;
        audioWin.play();
    }

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

    // Card for every gif of gifs (each will appear twice)
    function createCards(gifs) {
        const gameBoard = document.getElementById("game");
        for (let gif of gifs) {
            let thisCard = document.createElement("div");
            thisCard.classList.add(gif, "aCard", "front");
            gameBoard.append(thisCard);
            thisCard.addEventListener("click", handleCardClick);
        }
    }
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

            // if they are matched, add matched, removed clicked
            if (firstSelection === secondSelection) {
                playMatch();
                let matches = document.querySelectorAll(".clicked");
                matchesMade++;
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
                counter = 0;
                firstSelection = "";
                secondSelection = "";
                // if its end of game
                if (possibleMatches === matchesMade) {
                    playWin();
                    return endGame();
                }
            }
            // if it is not a match, and counter is 2, reset selections, reset counter, disable the board, and unflip cards.
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

    function endGame() {
        let topScore = document.querySelector("#high-score");
        let topScoreNum = document
            .querySelector("#high-score")
            .innerText.replace(/\D/g, "");
        let curScore = document.querySelector("#timer-display").innerText;
        let curScoreNum = document
            .querySelector("#timer-display")
            .innerText.replace(/\D/g, "");
        pauseTime();
        if (topScoreNum == 0) topScore.innerText = `High Score: ${curScore}`;
        if (curScoreNum < topScoreNum)
            topScore.innerText = `High Score: ${curScore}`;
        resetGame();
    }

    function resetGame() {
        matchesMade = 0;
        document.querySelector("#current-score").innerText = `Your Score: 0`;
        resetTimer();
        document.querySelector("#game").replaceChildren();
        shuffle(GIFS);
        createCards(gifs);
        startTimer();
        disable = true;
        document.querySelector("#start").classList.add("retry");
        document.querySelector("#start").innerText = "👹TRY AGAIN?👹";
        document.querySelector(".wrapper").classList.add("hidden");
    }

    /** Handle clicking on a card: this could be first-card or second-card. */
    function handleCardClick(event) {
        flipCard(event);
    }

    function startTimer() {
        document.querySelector("#start").addEventListener("click", () => {
            if (int !== null) {
                clearInterval(int);
            }
            int = setInterval(displayTimer, 10);
            document.querySelector("#start").classList.remove("retry");
            document.querySelector(".wrapper").classList.remove("hidden");
            disable = false;
            if (musicPlaying === false) playStart();
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
})();
