import { Injectable } from '@angular/core';
import { EntityState } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';
import * as GameActions from '../../store/game/game.actions';
import { Game } from '../interfaces/game';

@Injectable()
export class GameService {
  games$: Observable<Game[] | any>;
  gameState$: Observable<EntityState<Game>>;

  constructor(private store: Store<AppState>) {
    this.games$ = this.store.pipe(
      select('gameState', 'entities'),
      map((entities) => Object.values(entities))
    );
    this.gameState$ = this.store.pipe(select('gameState'));
  }

  loadGames() {
    this.store.dispatch(GameActions.loadGames());
  }

  addGame(game: Game) {
    this.store.dispatch(GameActions.addGame({ game }));
  }
}
