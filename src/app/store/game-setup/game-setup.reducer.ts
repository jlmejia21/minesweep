import { createReducer, on } from '@ngrx/store';
import {
  LoadGameSetupFailure,
  LoadGameSetupFinishGame,
  LoadGameSetupInit,
  LoadGameSetupLoad,
  LoadGameSetupSuccess,
} from './game-setup.actions';

export interface GameSetupState {
  data: any | null;
  loaded: boolean;
  loading: boolean;
  error?: string | null;
}

const gameSetupInitialState: GameSetupState = {
  data: null,
  loaded: false,
  loading: false,
  error: null,
};

export const gameSetupReducer = createReducer(
  gameSetupInitialState,
  on(LoadGameSetupInit, (state) => ({
    ...state,
    data: null,
    loaded: false,
    error: null,
    loading: false,
  })),
  on(LoadGameSetupLoad, (state) => ({
    ...state,
    loading: true,
  })),
  on(LoadGameSetupSuccess, (state, { gameSetup }) => ({
    ...state,
    data: { ...gameSetup },
    loaded: true,
    loading: false,
    error: null,
  })),
  on(LoadGameSetupFinishGame, (state, { endTime }) => ({
    ...state,
    data: { ...state.data, endTime },
    loaded: true,
    loading: false,
    error: null,
  })),
  on(LoadGameSetupFailure, (state, { error }) => ({
    ...state,
    error,
    loaded: true,
    loading: false,
  }))
);
