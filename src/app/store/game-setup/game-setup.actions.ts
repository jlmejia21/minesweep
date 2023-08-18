import { createAction, props } from '@ngrx/store';

export const LoadGameSetupInit = createAction('[Game Setup] - Init');
export const LoadGameSetupLoad = createAction(
  '[Game Setup] - Load',
  props<{ rows: number; columns: number; level: number }>()
);
export const LoadGameSetupSuccess = createAction(
  '[Game Setup] - Success',
  props<{ gameSetup: any }>()
);

export const LoadGameSetupFinishGame = createAction(
  '[Game Setup] - FinshGame',
  props<{ endTime: any }>()
);
export const LoadGameSetupFailure = createAction(
  '[Game Setup] - Failure',
  props<{ error: string | null }>()
);
