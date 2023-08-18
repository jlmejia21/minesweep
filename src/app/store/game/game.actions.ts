import { createAction, props } from '@ngrx/store';
import { Game } from 'src/app/commons/interfaces/game';

export const loadGames = createAction('[Game] Load Games');
export const loadGamesSuccess = createAction(
  '[Game] Load Games Success',
  props<{ games: Game[] }>()
);
export const addGame = createAction('[Game] Add Game', props<{ game: Game }>());
export const addGameSuccess = createAction(
  '[Game] Add Game Success',
  props<{ game: Game }>()
);
