import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';
import { v4 as uuidv4 } from 'uuid';
/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: Math.random(),
  };

  constructor(props) {
    super(props);

    const { nrows, ncols, chanceLightStartsOn } = this.props;
    // [...new Array(nrows)]
    //  = [undefined, undefined, undefined, undefined, undefined]
    //
    // [[undefined, undefined, undefined, undefined, undefined],
    //  [undefined, undefined, undefined, undefined, undefined],
    //  [undefined, undefined, undefined, undefined, undefined],
    //  [undefined, undefined, undefined, undefined, undefined],
    //  [undefined, undefined, undefined, undefined, undefined]]

    // [[true, false, true, true, false],
    //  [false, false, false, true, true],...
    //]
    this.state = {
      hasWon: false,
      // create a board
      board: [...new Array(nrows)].map(() =>
        [...new Array(ncols)].map(() => Math.random() > chanceLightStartsOn)
      ),
    };

    // this.createBoard = this.createBoard.bind(this);
    this.flipCellsAround = this.flipCellsAround.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  // createBoard() {
  //   let board = [];
  //   // TODO: create array-of-arrays of true/false values

  //   return board;
  // }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split('-').map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // flip this cell and the cells around it
    flipCell(y, x);
    // up, left, down, right
    flipCell(y - 1, x);
    flipCell(y, x + 1);
    flipCell(y + 1, x);
    flipCell(y, x - 1);

    // win when every cell is turned off
    // determine is the game has been won
    let hasWon = true;
    for (let j = 0; j < board.length; j++) {
      for (let i = 0; i < board[j].length; i++) {
        if (board[j][i]) hasWon = false;
      }
    }

    this.setState({ board, hasWon });
  }

  /** Render game board or winning message. */

  render() {
    const { hasWon, board } = this.state;
    // if the game is won, just show a winning msg & render nothing else
    if (hasWon) return `YOU WIN`;
    // make table board
    return (
      <table className='Board'>
        <tbody>
          {board.map((row, y) => (
            <tr key={uuidv4()}>
              {row.map((cell, x) => (
                <Cell
                  key={uuidv4()}
                  isLit={cell}
                  flipCellsAroundMe={() => this.flipCellsAround(`${y}-${x}`)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default Board;
