import { moveCosts, targets } from "./constants.js";

export default class GamePiece {
  constructor(type, row, col, board) {
    this.type = type;
    this.pos = { row, col };
    this.moveCost = moveCosts[type];
    this.targets = targets[type];
    this.board = board;
  }

  planMoveTo(row, col) {
    if (this.board[row][col] !== 'space') return null;
  }
}
