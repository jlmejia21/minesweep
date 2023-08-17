import { Component, OnInit } from '@angular/core';

interface Coordinate {
  x: number;
  y: number;
  status: string;
  mine: boolean;
  text?: number;
}

type CoordinateMine = Pick<Coordinate, 'x' | 'y'>;

const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Minesweep';
  rows = 10;
  columns = 10;
  numberMines = 10;
  numberMinesText = '';
  board: Coordinate[][] = [];
  showRecord = false;
  ngOnInit(): void {
    this.numberMinesText = this.numberMines.toString();
    this.board = this.createBoard();
    document.documentElement.style.setProperty('--rows', this.rows.toString());
    document.documentElement.style.setProperty(
      '--columns',
      this.columns.toString()
    );
  }

  createBoard() {
    const board = [];
    const minePositions = this.getMinePositions(
      this.rows,
      this.columns,
      this.numberMines
    );
    for (let x = 0; x < this.rows; x++) {
      const row: Coordinate[] = [];
      for (let y = 0; y < this.columns; y++) {
        const tile: Coordinate = {
          x,
          y,
          mine: minePositions.some((m) => this.positionMatch(m, { x, y })),
          status: TILE_STATUSES.HIDDEN,
        };
        row.push(tile);
      }
      board.push(row);
    }
    return board;
  }

  getMinePositions(rows: number, columns: number, numberOfMines: number) {
    const positions: CoordinateMine[] = [];
    while (positions.length < numberOfMines) {
      const position = {
        x: this.randomNumber(rows),
        y: this.randomNumber(columns),
      };
      if (!positions.some((p) => this.positionMatch(p, position))) {
        positions.push(position);
      }
    }
    return positions;
  }

  positionMatch(a: CoordinateMine, b: CoordinateMine) {
    return a.x === b.x && a.y === b.y;
  }
  randomNumber(size: number) {
    return Math.floor(Math.random() * size);
  }

  markTile(tile: Coordinate) {
    if (
      tile.status !== TILE_STATUSES.HIDDEN &&
      tile.status !== TILE_STATUSES.MARKED
    )
      return;
    if (tile.status === TILE_STATUSES.MARKED)
      tile.status = TILE_STATUSES.HIDDEN;
    else {
      // TODO: Ultimo cambio.
      if (this.markedTileCount() < this.numberMines)
        tile.status = TILE_STATUSES.MARKED;
    }
  }

  onClick(cell: Coordinate) {
    if (this.showRecord) return;
    this.revealTile(this.board, cell);
    this.checkGameEnd();
  }

  revealTile(board: Coordinate[][], cell: Coordinate) {
    if (cell.status !== TILE_STATUSES.HIDDEN) {
      return;
    }

    if (cell.mine) {
      cell.status = TILE_STATUSES.MINE;
      return;
    }

    cell.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = this.nearbyTiles(board, cell);
    const mines = adjacentTiles.filter((t) => t.mine);
    if (mines.length === 0) {
      adjacentTiles.forEach((cell) => this.onClick(cell));
    } else {
      cell.text = mines.length;
    }
  }
  nearbyTiles(board: Coordinate[][], cell: Coordinate) {
    const tiles = [];
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const tile = board[cell.x + xOffset]?.[cell.y + yOffset];
        if (tile) tiles.push(tile);
      }
    }
    return tiles;
  }

  onRightClick(e: any, cell: Coordinate) {
    e.preventDefault();
    if (this.showRecord) return;
    this.markTile(cell);
    this.listMinesLeft();
  }

  listMinesLeft() {
    this.numberMinesText = '';
    const markedTileCount = this.markedTileCount();
    const result = this.numberMines - markedTileCount;
    this.numberMinesText = result.toString();
  }

  markedTileCount() {
    return this.board.reduce(
      (c, r) =>
        c + r.filter((tile) => tile.status === TILE_STATUSES.MARKED).length,
      0
    );
  }

  checkGameEnd() {
    const win = this.checkWin(this.board);
    const lose = this.checkLose(this.board);
    if (win || lose) this.showRecord = true;
    if (win) this.numberMinesText = 'Ganaste!! 🤩🥳';
    if (lose) {
      this.numberMinesText = 'Perdiste, intentalo nuevamente 😎';
      this.board.forEach((row) => {
        row.forEach((tile) => {
          if (tile.status === TILE_STATUSES.MARKED) this.markTile(tile);
          if (tile.mine) this.revealTile(this.board, tile);
        });
      });
    }
  }

  checkWin(board: Coordinate[][]) {
    return board.every((row) => {
      return row.every((tile) => {
        return (
          tile.status === TILE_STATUSES.NUMBER ||
          (tile.mine &&
            (tile.status === TILE_STATUSES.HIDDEN ||
              tile.status === TILE_STATUSES.MARKED))
        );
      });
    });
  }

  checkLose(board: Coordinate[][]) {
    return board.some((row) => {
      return row.some((tile) => {
        return tile.status === TILE_STATUSES.MINE;
      });
    });
  }
}
