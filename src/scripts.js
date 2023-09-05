/**
 * Symbols for the game
 */

// Initializes the DOMParser
const parser = new DOMParser();

const oSymbol = `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    fill="none"
    class="playground__icon--circle"
    >
    <path
    d="M54.5454 3.63635V7.27272H61.8182V10.9091H65.4545V14.5454H69.0909V18.1818H72.7273V25.4545H76.3636V54.5454H72.7273V61.8182H69.0909V65.4545H65.4545V69.0909H61.8182V72.7273H54.5454V76.3636H25.4545V72.7273H18.1818V69.0909H14.5454V65.4545H10.9091V61.8182H7.27272V54.5454H3.63635V25.4545H7.27272V18.1818H10.9091V14.5454H14.5454V10.9091H18.1818V7.27272H25.4545V3.63635H54.5454Z"
    fill="#E9C46A"
    />
</svg>`;

const xSymbol = `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    fill="none"
    class="playground__icon--x"
    >
    <path
    d="M76 76H61.4V68.7H54.1V61.4H46.8V54.1H32.2V61.4H24.9V68.7H17.6V76H3V61.4H10.3V54.1H17.6V46.8H24.9V32.2H17.6V24.9H10.3V17.6H3V3H17.6V10.3H24.9V17.6H32.2V24.9H46.8V17.6H54.1V10.3H61.4V3H76V17.6H68.7V24.9H61.4V32.2H54.1V46.8H61.4V54.1H68.7V61.4H76V76Z"
    fill="#E76F51"
    />
</svg>`;

/**
 * Winning combinations for the game
 * @type {Number[][]}
 */
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * @param {MouseEvent} event
 * @returns
 */
function addSymbol(event) {
  const cell = event.currentTarget;
  const cellIndex = cell.getAttribute("data-index");

  // checks if cell is empty
  if (cell.children.length > 0) return;

  // adds symbol to the cell
  cell.appendChild(
    parser.parseFromString(player === "X" ? xSymbol : oSymbol, "image/svg+xml")
      .documentElement
  );

  // handles table state
  player === "X"
    ? xCellIndexes.push(parseInt(cellIndex))
    : oCellIndexes.push(parseInt(cellIndex));

  // checks if there is a winner
  checkWinner(player);

  // checks if it should be reset
  checkReset();

  // changes player
  player = player === "X" ? "O" : "X";
}

function checkReset() {
  if (xCellIndexes.length + oCellIndexes.length === 9) {
    setTimeout(() => {
      alert("It's a tie!");
      resetGame();
    });
  }
}

/**
 * Accepts a player and checks if they are a winner.
 * More efficient than checking each x and y cell indexes
 *
 * @param {"X" | "O"} player
 * @returns void
 */
function checkWinner(player) {
  // checks if player is a winner
  for (let combination of winningCombinations) {
    if (
      // checks for X cells
      player === "X" &&
      combination.every((index) => xCellIndexes.includes(index))
    ) {
      styleWinnigCells(combination);
      setTimeout(() => {
        alert(`X is the winner!`);
        resetGame();
      }, 500);
    } else if (
      // checks for Y cells
      player === "O" &&
      combination.every((index) => oCellIndexes.includes(index))
    ) {
      styleWinnigCells(combination);
      setTimeout(() => {
        alert(`O is the winner!`);
        resetGame();
      }, 500);
    } else {
      continue;
    }
  }
}

function styleWinnigCells(combination) {
  const cells = document.querySelectorAll(".playground__table .cell");
  for (let cell of cells) {
    if (combination.includes(parseInt(cell.getAttribute("data-index")))) {
      cell.classList.add("cell--winner");
    }
  }
}

function resetGame() {
  // resets the game
  xCellIndexes = [];
  oCellIndexes = [];
  player = "X";
  const cells = document.querySelectorAll(".playground__table .cell");
  for (let cell of cells) {
    cell.innerHTML = "";
    cell.classList.remove("cell--winner");
  }
}

// = = = = = = = = = = MAIN = = = = = = = = = =

/**
 * @type {String[]}
 */
let xCellIndexes = [];

/**
 * @type {String[]}
 */
let oCellIndexes = [];

/**
 * @type {"X" | "O"}
 */
let player = "X";

/**
 * @type {Number[]}
 */
let winningCombination = [];

// Gets the table rows
const table = document.querySelectorAll(".playground__table .row");

// Gets the cells
for (let row of table) {
  for (let cell of row.children) {
    // adds click listener to the cell
    cell.addEventListener("click", addSymbol);
  }
}
