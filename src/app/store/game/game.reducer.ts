import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Game } from 'src/app/commons/interfaces/game';
import * as GameActions from './game.actions';

export interface GameState extends EntityState<Game> {}

export const gameAdapter = createEntityAdapter<Game>();

export const initialState: GameState = gameAdapter.getInitialState();

export const gameReducer = createReducer(
  initialState,
  on(GameActions.loadGamesSuccess, (state, { games }) =>
    gameAdapter.setAll(games, state)
  ),
  on(GameActions.addGameSuccess, (state, { game }) =>
    gameAdapter.addOne(game, state)
  )
);
