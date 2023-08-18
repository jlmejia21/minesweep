import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
  GameSetupState,
  gameSetupReducer,
} from './game-setup/game-setup.reducer';
import { GameState, gameReducer } from './game/game.reducer';
import { hydrationMetaReducer } from './hydration/hydration.reducer';

export interface AppState {
  gameSetupStore: GameSetupState;
  gameState: GameState;
}

export const appReducers: ActionReducerMap<AppState> = {
  gameSetupStore: gameSetupReducer,
  gameState: gameReducer,
};

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];
