//To work on:
//Take in letters input as a pattern
//Same current pattern
//Step backwards (many times)
//Mirror mode (unable to solve how to mirror 2 arrays properly)

const unitLength = 20;
const strokeColor = 200;
const strokeColorSelected = 50;
const boxColor = {
  "color-v1": [[255, 204, 204], [51, 0, 0]],
  "color-v2": [[255, 229, 204], [51, 25, 0]],
  "color-v3": [[255, 255, 204], [51, 51, 0]],
  "color-v4": [[229, 255, 204], [25, 51, 0]],
  "color-v5": [[204, 255, 204], [0, 51, 0]],
  "color-v6": [[204, 255, 229], [0, 51, 25]],
  "color-v7": [[204, 255, 255], [0, 51, 51]],
  "color-v8": [[204, 229, 255], [0, 25, 51]],
  "color-v9": [[204, 204, 255], [0, 0, 51]],
  "color-v10": [[229, 204, 255], [25, 0, 51]],
  "color-v11": [[255, 204, 255], [51, 0, 51]],
  "color-v12": [[255, 204, 229], [51, 0, 25]],
  "color-random": [[Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)], [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]],
};
let currentColorTheme = boxColor["color-random"];

let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let tempBoard;

//used for mirror mode under construction
let mirrorBoardA;
let mirrorBoardB;
let mirrorNextBoardA;
let mirrorNextBoardB;

let fps = 15;
const FPS_MAX = 60;
const FPS_MIN = 0.9375;

let minNeighborToSurvive = 2;
let maxNeighborToSurvive = 3;
let neighborToReproduce = 3;

let isRandomGame = false;
let isColorRandom = true;
let isFirstLoad = true;

let isNormal = true;
let isHighLife = false;
let isCustomize = false;

//used for mirror mode under construction
let isMirror = false;

let lastMouseClickedOnBoard = [];
let lastKeyboardPos = [];

const GAME_MODE_DESCRIPTIONS = {
  "normal-game": "Following Standard Rules",
  "high-life-mode": "Reproduce if Having 3 or 6 Neighbors",
  "full-custom": "Full Customization - Update Rules manually",
  "mirror-mode": "Mirror Canvas TBCCCCCCC"
}

const PATTERN = {

  "HELLO": `..............O..O.OOO.O...O...OOOO..0.0
..............O..O.O...O...O...O..O..0.0
..............OOOO.OO..O...O...O..O..0.0
..............O..O.O...O...O...O..O.....
..............O..O.OOO.OOO.OOO.OOOO..0.0


OOOO.OOOO.OOOOO.OOO...OOOO.OOO...O...OOO.OOO.OOO
O....O..O.O.O.O.O.....O..O.O.....O....O..O...O..
O.OO.OOOO.O.O.O.OO....O..O.OO....O....O..OO..OO.
O..O.O..O.O...O.O.....O..O.O.....O....O..O...O..
OOOO.O..O.O...O.OOO...OOOO.O.....OOO.OOO.O...OOO`,

  "glider": `.O
..O
OOO`,

  "gosper-glider-gun": `........................O
......................O.O
............OO......OO............OO
...........O...O....OO............OO
OO........O.....O...OO
OO........O...O.OO....O.O
..........O.....O.......O
...........O...O
............OO`,

  "lightweight-spaceship": `.O..O
O
O...O
OOOO`,

  "blinker": `OOO`,

  "switch-engine": `.O.O
O
.O..O
...OOO`,

  "venetian-blinds": `OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO
OO..OO..OO..OO..OO..OO..OO..OO..OO..OO`,

  "twin-bees-shuttle": `.................OO..........
OO...............O.O.......OO
OO.................O.......OO
.................OOO.........
.............................
.............................
.............................
.................OOO.........
OO.................O.........
OO...............O.O.........
.................OO..........`,

  "simkin-glider-gun": `OO.....OO........................
OO.....OO........................
.................................
....OO...........................
....OO...........................
.................................
.................................
.................................
.................................
......................OO.OO......
.....................O.....O.....
.....................O......O..OO
.....................OOO...O...OO
..........................O......
.................................
.................................
.................................
....................OO...........
....................O............
.....................OOO.........
.......................O.........`,

  "block-laying-switch-engine": `..................O
.OOO........O.....O
O...O......O.......O
.OO.........OOOO..OO
...OO.OO.........OOO
.....OO...........O.O
...................O.......OO
...................O.......OO










.......OO
.......OO






...............OO
...............OO`,

  "copperhead": `.OO..OO.
...OO...
...OO...
O.O..O.O
O......O
........
O......O
.OO..OO.
..OOOO..
........
...OO...
...OO...`,

}

const startBtn = document.querySelector("#start-game");
const stopBtn = document.querySelector("#stop-game");
const gameVariationSelects = document.querySelector("#game-variations");
const gameModeDescriptions = document.querySelector("#game-mode-descriptions");
const speedUpBtn = document.querySelector("#speed-up");
const slowDownBtn = document.querySelector("#slow-down");
const resetBtn = document.querySelector("#reset-game");
const speedControlSlider = document.querySelector("#fps-slider-control");
const stepFwdBtn = document.querySelector("#step-forward");
const genPatternSelect = document.querySelector("#generate-patterns-select");
const genPatternBtn = document.querySelector(".generate-patterns");
const colorThemeSelects = document.querySelector("#color-theme-select");
const survivalCustomSelects = document.querySelector("#survival-custom");
const reproductionCustomSelects = document.querySelector("#reproduction-custom");
const colorBoxDisplay = document.querySelector(".color-box-display");
const colorBoxDisplayRandom = document.querySelector(".color-box-display-random");

colorBoxDisplay.style.display = "none";

function setup() {
  const canvas = createCanvas(windowWidth - 50, windowHeight - 100);
  canvas.parent(document.querySelector("#canvas"));

  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  //mirror mode under construction
  if (isMirror) {
    mirrorSetup();
  }

  currentBoard = [];
  nextBoard = [];

  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }

  lastMouseClickedOnBoard = [(width / 2), (height / 2)];

  frameRate(fps);
  noLoop();
  init();
}

//not using, isMirror always false
function mirrorSetup() {
  //make columns even for mirror mode
  if (columns % 2 == 1){
    columns--;
  }

  mirrorBoardA = [];
  mirrorBoardB = [];
  mirrorNextBoardA = [];
  mirrorNextBoardB = [];

  for (let i = 0; i < (columns / 2); i++) {
    mirrorBoardA[i] = [];
    mirrorBoardB[i] = [];
    mirrorNextBoardA[i] = [];
    mirrorNextBoardB[i] = [];
  }
}

function init() {
  //isMirror always false, mirror mode under construction
  isMirror ? genCurrentBoardWithMirror() : genCurrentBoard();

  if (isRandomGame && isColorRandom) {
    fillLifeWithRandomColor();
  } else if (isRandomGame) {
    fillLifeWithColor();
  } else {
    loop();
  }

}

function genCurrentBoard() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = isRandomGame ? (random() > 0.8 ? [1, 0] : [0, 0]) : [0, 0];
      nextBoard[i][j] = [0, 0];
      //second element currentBoard[i][j][1] is for number of rounds of survival life
      //currentBoard[X-pos][Y-pos][life, survival round]
    }
  }
}

//not using, isMirror always false
function genCurrentBoardWithMirror() {
  for (let i = 0; i < (columns / 2); i++) {
    for (let j = 0; j < rows; j++) {
      mirrorBoardA[i][j] = isRandomGame ? (random() > 0.8 ? [1, 0] : [0, 0]) : [0, 0];
      mirrorNextBoardA[i][j] = [0, 0];
    }
  }

  //unknown behavior for mirroring 2 arrays
  console.log(`mirror A: ${mirrorBoardA}`);
  console.log(`mirror b: ${mirrorBoardB}`);

  mirrorBoard(mirrorBoardA, mirrorBoardB);
  currentBoard = mirrorBoardA.concat(mirrorBoardB);

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      nextBoard[i][j] = [0, 0];
    }
  }
}

function genCurrentBoardWithPattern(patternArr) {
  //calculate center coordinate of pattern (by knowing the highest height and width)
  let patternHeight = Math.floor(patternArr.length);
  let patternWidth = patternArr.reduce((longestWidth, curr) => {
    if (curr.length > longestWidth) {
      longestWidth = curr.length;
    }
    return longestWidth;
  }, 0)
  //calculate starting drawing position of pattern, in accordance to the center of the board
  let startingX = Math.floor((columns - patternWidth) / 2);
  let startingY = Math.floor((rows - patternHeight) / 2);

  for (let i = 0; i < patternArr.length; i++) {
    for (let j = 0; j < patternArr[i].length; j++) {
      currentBoard[j + startingX][i + startingY] = patternArr[i][j] === "O" ? [1, 0] : [0, 0];
      nextBoard[j + startingX][i + startingY] = [0, 0];
    }
  }
}

function windowResized() {
  noLoop()
  resizeCanvas(windowWidth - 50, windowHeight - 100);
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);
  tempBoard = [];
  for (let i = 0; i < columns; i++) {
    tempBoard[i] = [];
  }
  genTempBoardFromCurrentBoard();
  lastMouseClickedOnBoard = [(width / 2), (height / 2)];
  loop();
}

//unknown error?? tempBoard undefined??
function genTempBoardFromCurrentBoard() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      tempBoard[i][j][0] = currentBoard[i][j][0];
      tempBoard[i][j][1] = currentBoard[i][j][1];
    }
  }
  currentBoard = [];
  nextBoard = [];
}

function draw() {
  background(255);
  //isMirror always false, mirror mode under construction
  isMirror ? mirrorModeGenerate() : generate();
  isColorRandom ? fillLifeWithRandomColor() : fillLifeWithColor();

  if (isFirstLoad) {
    drawPattern(PATTERN["HELLO"]);
    isFirstLoad = false;
    noLoop()
  }
}

function mirrorModeGenerate() {
  //Loop over every single box on the positive X board
  for (let x = 0; x < (columns / 2); x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors += mirrorBoardA[(x + i + (columns / 2)) % (columns / 2)][(y + j + rows) % rows][0];
        }
      }
      // Rules of Life
      if (mirrorBoardA[x][y][0] == 1 && (neighbors < minNeighborToSurvive || neighbors > maxNeighborToSurvive)) {
        // Die of Loneliness
        // Die of Overpopulation
        mirrorNextBoardA[x][y] = [0, 0];
      } else if (mirrorBoardA[x][y][0] == 0 && (neighbors == neighborToReproduce || (isHighLife && neighbors == 6))) {
        // New life due to Reproduction
        // adding High Life condition
        mirrorNextBoardA[x][y] = [1, 0];
      } else {
        // Stasis
        mirrorNextBoardA[x][y] = mirrorBoardA[x][y];
        //survival round += 1
        mirrorNextBoardA[x][y][1]++;
      }
    }
  }

  // mirror 2 boards and combine into current board
  mirrorBoard(mirrorBoardA, mirrorBoardB);
  currentBoard = mirrorBoardA.concat(mirrorBoardB);

  mirrorBoard(mirrorNextBoardA, mirrorBoardB);
  nextBoard = mirrorNextBoardA.concat(mirrorNextBoardB);

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows][0];
        }
      }
      // Rules of Life
      if (currentBoard[x][y][0] == 1 && (neighbors < minNeighborToSurvive || neighbors > maxNeighborToSurvive)) {
        // Die of Loneliness
        // Die of Overpopulation
        nextBoard[x][y] = [0, 0];
      } else if (currentBoard[x][y][0] == 0 && (neighbors == neighborToReproduce || (isHighLife && neighbors == 6))) {
        // New life due to Reproduction
        // adding High Life condition
        nextBoard[x][y] = [1, 0];
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
        //survival round += 1
        nextBoard[x][y][1]++;
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function fillLifeWithColor() {
  let colorCode = 0;
  let currentColorArr = genColorStep(currentColorTheme);

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      //check if currentBoard[i][[j][1] (survival round) to determine if use darken color
      if (currentBoard[i][j][1] > 8) {
        colorCode = 8;
      } else {
        colorCode = currentBoard[i][j][1];
      }

      if (currentBoard[i][j][0] == 1) {
        fill(currentColorArr[colorCode][0], currentColorArr[colorCode][1], currentColorArr[colorCode][2]);
      } else {
        fill(255);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
  isRandomGame = false;
}

function fillLifeWithRandomColor() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j][0] == 1) {
        //fill random rgb color
        fill(Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256));
      } else {
        fill(255);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
}

// When mouse is dragged
function mouseDragged() {
  // If the mouse coordinate is outside the board
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  lastMouseClickedOnBoard = [mouseX, mouseY];
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);

  currentBoard[x][y] = [1, 0];

  isColorRandom ? fillLifeWithRandomColor() : fillLifeWithColor;
  //will have error on this line if using random color, but it's okay.
  fill(currentColorTheme[0], currentColorTheme[1], currentColorTheme[2]);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
  noLoop();
}

// When mouse is pressed
function mousePressed() {
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  lastKeyboardPos = [];
  lastMouseClickedOnBoard = [mouseX, mouseY];
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);

  isColorRandom ? fillLifeWithRandomColor() : fillLifeWithColor;
  noLoop();
  mouseDragged();
}

// To be work on: to highlight current keyboard position
// change color accordingly when color box change (not work when color is random)
function keyPressed() {
  //board only responsive if user is pressing arrow keys
  if (!(keyCode >= 37 && keyCode <= 40)) {
    return;
  }
  let x;
  let y;
  //check if keyboard was previously using to draw
  //checking if lastKeyboardPos is empty
  if (lastKeyboardPos.length == 0) {
    //if empty, using last mouse clicked position
    x = Math.floor(lastMouseClickedOnBoard[0] / unitLength);
    y = Math.floor(lastMouseClickedOnBoard[1] / unitLength);
    moveWithKeyboard(x, y);
  } else if (lastKeyboardPos.length == 2) {
    //if not empty, using last keyboard drawn position
    x = lastKeyboardPos[0];
    y = lastKeyboardPos[1];
    moveWithKeyboard(x, y);
  }

  fill(currentColorTheme[0], currentColorTheme[1], currentColorTheme[2]);
  stroke(strokeColor);
  noLoop();
}

function moveWithKeyboard(x, y) {
  //check if the box is really clicked and filled
  if (currentBoard[x][y][0] != 0) {
    if (keyCode === LEFT_ARROW) {
      currentBoard[x - 1][y] = [1, 0];
      rect((x - 1) * unitLength, y * unitLength, unitLength, unitLength);
      lastKeyboardPos = [x - 1, y];
    } else if (keyCode === RIGHT_ARROW) {
      currentBoard[x + 1][y] = [1, 0];
      rect((x + 1) * unitLength, y * unitLength, unitLength, unitLength);
      lastKeyboardPos = [x + 1, y];
    } else if (keyCode === DOWN_ARROW) {
      currentBoard[x][y + 1] = [1, 0];
      rect(x * unitLength, (y + 1) * unitLength, unitLength, unitLength);
      lastKeyboardPos = [x, y + 1];
    } else if (keyCode === UP_ARROW) {
      currentBoard[x][y - 1] = [1, 0];
      rect(x * unitLength, (y - 1) * unitLength, unitLength, unitLength);
      lastKeyboardPos = [x, y - 1];
    };
  };
}

function resetGameValue() {
  fps = 15;
  minNeighborToSurvive = 2;
  maxNeighborToSurvive = 3;
  neighborToReproduce = 3;
  isRandomGame = false;
  lastKeyboardPos = [];
}

function clearBoard() {
  setup();
}

function drawPattern(patternStr) {
  let patternArr = patternToArr(patternStr);
  genCurrentBoard();
  genCurrentBoardWithPattern(patternArr)
  isColorRandom || isFirstLoad ? fillLifeWithRandomColor() : fillLifeWithColor();
}

function updateGameMode(select) {
  gameModeDescriptions.innerHTML = GAME_MODE_DESCRIPTIONS[select];

  isNormal = select === "normal-game";
  isHighLife = select === "high-life-mode";
  isCustomize = select === "full-custom";
  //isMirror selection disabled in HTML
  isMirror = select === "mirror-mode";

  survivalCustomSelects.disabled = !isCustomize;
  reproductionCustomSelects.disabled = !isCustomize;

  survivalCustomSelects.value = "survival-default";
  reproductionCustomSelects.value = "reproduction-default";

  if (isHighLife) {
    reproductionCustomSelects.value = "reproduction-high-life";
  }

  if (isNormal) {
    minNeighborToSurvive = 2;
    maxNeighborToSurvive = 3;
    neighborToReproduce = 3;
  }

  //isMirror selection disabled in HTML
  if (isMirror) {
    clearBoard();
  }
}

function patternToArr(patterStr) {
  return patterStr.split("\n");
}

function genColorStep(colorArr) {
  //assume colorArr is an length-2 array: [[R, G, B], [R, G, B]]
  let resultColorStep = []
  for (let i = 0; i < 9; i++) {
    resultColorStep[i] = [0, 0, 0];
  }
  resultColorStep[0] = colorArr[0];
  resultColorStep[8] = colorArr[1];
  let stepAmt = 0;

  for (let j = 0; j < 3; j++) {
    stepAmt = Math.floor((colorArr[0][j] - colorArr[1][j]) / 9);
    for (let i = 1; i < 8; i++) {
      resultColorStep[i][j] = resultColorStep[i - 1][j] - stepAmt;
    }
  }
  //return a length-9 array: [[R, G, B], [R, G, B], ... ,[R, G, B]]
  return resultColorStep;
}

//Not Working???
function mirrorBoard(boardA, boardB) {
  let numRows = boardA.length;
  let numCols = boardA[0].length;

  for (let i = 0; i < numRows; i++) {
    for (let j = numCols - 1; j >= 0; j--) {
      boardB[i][numCols - j - 1] = boardA[i][j];
    }
  }
}

startBtn.addEventListener("click", () => {
  loop();
})

stopBtn.addEventListener("click", () => {
  noLoop();
})

resetBtn.addEventListener("click", () => {
  resetGameValue();
  clearBoard();
  updateGameMode("normal-game");
  gameVariationSelects.value = "normal-game";
  init();
  noLoop();
});

genPatternBtn.addEventListener("click", () => {
  const patternToDraw = genPatternSelect.value;
  if (patternToDraw == "random-initial") {
    isRandomGame = true;
    init();
  } else {
    drawPattern(PATTERN[patternToDraw]);
  }
  noLoop();
})

speedControlSlider.addEventListener("input", (e) => {
  fps = parseFloat(e.target.value);
  frameRate(fps);
})

speedUpBtn.addEventListener("click", () => {
  if (!(fps >= FPS_MAX)) {
    fps *= 2;
    frameRate(fps);
    speedControlSlider.value = fps.toString();
  }
});

slowDownBtn.addEventListener("click", () => {
  if (!(fps <= FPS_MIN)) {
    fps /= 2;
    frameRate(fps);
    speedControlSlider.value = fps.toString();
  }
});

stepFwdBtn.addEventListener("click", (e) => {
  noLoop();
  generate();
  isColorRandom ? fillLifeWithRandomColor() : fillLifeWithColor();
})

gameVariationSelects.addEventListener("change", (e) => {
  const selectedGameVariation = e.target.value;
  updateGameMode(selectedGameVariation);
})

colorThemeSelects.addEventListener("change", (e) => {
  let selectedColorTheme = e.target.value;
  if (selectedColorTheme === "color-random") {
    isColorRandom = true;
    colorBoxDisplayRandom.style.display = "block";
    colorBoxDisplay.style.display = "none";
  } else {
    isColorRandom = false;
    currentColorTheme = boxColor[selectedColorTheme];
    colorBoxDisplayRandom.style.display = "none";
    colorBoxDisplay.style.display = "block";
    colorBoxDisplay.style.backgroundColor = `rgb(${boxColor[selectedColorTheme][0][0]},
       ${boxColor[selectedColorTheme][0][1]}, 
       ${boxColor[selectedColorTheme][0][2]})`;
  }
  noLoop();
  isColorRandom ? fillLifeWithRandomColor() : fillLifeWithColor();
})

survivalCustomSelects.addEventListener("change", (e) => {
  let selectedSurvivalCustom = e.target.value;
  if (selectedSurvivalCustom === "survival-custom1") {
    minNeighborToSurvive = 1;
    maxNeighborToSurvive = 3;
  } else if (selectedSurvivalCustom === "survival-custom2") {
    minNeighborToSurvive = 0;
    maxNeighborToSurvive = 3
  } else if (selectedSurvivalCustom === "survival-custom3") {
    minNeighborToSurvive = 2;
    maxNeighborToSurvive = 4;
  } else if (selectedSurvivalCustom === "survival-custom4") {
    minNeighborToSurvive = 2;
    maxNeighborToSurvive = 5;
  } else if (selectedSurvivalCustom === "survival-custom5") {
    minNeighborToSurvive = 2;
    maxNeighborToSurvive = 6;
  } else if (selectedSurvivalCustom === "survival-default") {
    maxNeighborToSurvive = 2;
    minNeighborToSurvive = 3;
  }
})

reproductionCustomSelects.addEventListener("change", (e) => {
  let selectedReproductionCustom = e.target.value;
  if (selectedReproductionCustom === "reproduction-default") {
    neighborToReproduce = 3;
  } else if (selectedReproductionCustom === "reproduction-custom1") {
    neighborToReproduce = 4;
  } else if (selectedReproductionCustom === "reproduction-custom2") {
    neighborToReproduce = 5;
  } else if (selectedReproductionCustom === "reproduction-custom3") {
    neighborToReproduce = 6;
  }
})