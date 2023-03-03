"use strict";

const BASE_URL = "https://rickandmortyapi.com/api/character";
const MAX = 150;
const MIN = 1;

const $START_BUTTON = $("#start")
const $BOARD = $("#board")
const $TIME_DISPLAY = $("#timer-display");


//******* Probably can go in cards class */

/** Creates an array of count length containing randomly generated values.  */
function generateArray(count) {
  return Array.from({ length: count }, () => _.random(MIN, MAX));
}

/**
 * Pulls images from API to use for card game.
 *
 * Returns: Array of url linking to jpeg images.
*/
async function getImages(num) {
  try {
    let randomArray = generateArray(num);
    let response = await axios.get(`${BASE_URL}/${randomArray}`);
    return response.data.map((card) => card["image"]);
  } catch (e) {
    error.log(e);
  }
}

