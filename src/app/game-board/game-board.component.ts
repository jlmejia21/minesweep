import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TILE_STATUSES } from '../commons/enum/tileStatuses';
import { Coordinate, CoordinateMine } from '../commons/interfaces/coordinate';
import { Game } from '../commons/interfaces/game';
import { GameFbService } from '../commons/services/game-fb.service';
import { GameService } from '../commons/services/game.service';
import { AppState } from '../store/app.reducer';
import {
  LoadGameSetupFinishGame,
  LoadGameSetupInit,
} from '../store/game-setup/game-setup.actions';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class GameBoardComponent implements OnDestroy {
  rows: number = 0;
  columns: number = 0;
  numberMines: number = 0;
  descriptionMines: string = '';
  startTime: any;
  endTime: any;

  numberMinesText = '';
  board: Coordinate[][] = [];
  showRecord = false;

  constructor(
    private store: Store<AppState>,
    private gameService: GameService,
    private gameFbService: GameFbService
  ) {
    this.store
      .select('gameSetupStore')
      .pipe(takeUntilDestroyed())
      .subscribe(({ loaded, data }) => {
        if (loaded && data && !data?.endTime) {
          this.showRecord = false;
          this.rows = Number(data.rows);
          this.columns = Number(data.columns);
          this.descriptionMines = data.levelDescription;
          this.numberMines = data.level;
          this.startTime = data.startTime;
          this.numberMinesText = this.numberMines.toString();
          this.board = this.createBoard();
          document.documentElement.style.setProperty(
            '--rows',
            this.rows.toString()
          );
          document.documentElement.style.setProperty(
            '--columns',
            this.columns.toString()
          );
        }
        if (loaded && data && data?.endTime) this.endTime = data.endTime;
      });
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.showRecord) {
      this.store.dispatch(LoadGameSetupInit());
    }
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

  onClick(cell: Coordinate, event: any) {
    console.log(event);
    if (this.showRecord) return;
    this.revealTile(this.board, cell);
    this.checkGameEnd(event);
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
      adjacentTiles.forEach((cell) => this.revealTile(this.board, cell));
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

  checkGameEnd(event: any) {
    const win = this.checkWin(this.board);
    const lose = this.checkLose(this.board);
    if (win || lose) {
      event.stopImmediatePropagation();
      this.showRecord = true;
      this.store.dispatch(LoadGameSetupFinishGame({ endTime: new Date() }));
      const status = win ? 'Ganó' : 'Perdió';
      this.addGame(status);
    }
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

  stopProp(e: any) {
    e.stopImmediatePropagation();
  }

  addGame(status: string) {
    console.log('aaa');
    const newGame: Game = {
      id: '',
      startTime: this.startTime.toString(),
      endTime: this.endTime.toString(),
      difficulty: this.descriptionMines,
      spentTime: Math.abs(this.endTime - this.startTime),
      status,
    };
    this.gameFbService.addGame(newGame);
    // this.gameService.addGame(newGame);
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

  finishGame() {
    this.store.dispatch(LoadGameSetupInit());
  }
}
