import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { DbService } from 'src/app/commons/services/db.service';
import * as GameActions from './game.actions';
@Injectable()
export class GameEffects {
  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGames),
      switchMap(() => this.dbService.getGamesCollection()),
      switchMap((gamesCollection) => {
        return gamesCollection.games.find({}).$;
      }),
      map((games: any) => {
        return GameActions.loadGamesSuccess({
          games: games.map((g: any) => g._data),
        });
      })
    )
  );

  addGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.addGame),
      switchMap(({ game }) =>
        this.dbService.getGamesCollection().then((gamesCollection) =>
          gamesCollection.games
            .insert({
              ...game,
              id: Date.now().toString(),
            })
            .then((document) => document.toJSON())
        )
      ),
      map((game) => GameActions.addGameSuccess({ game }))
    )
  );

  constructor(private actions$: Actions, private dbService: DbService) {}
}
