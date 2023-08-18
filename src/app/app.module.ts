import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DbService } from './commons/services/db.service';
import { GameService } from './commons/services/game.service';
import { appReducers, metaReducers } from './store/app.reducer';
import { GameEffects } from './store/game/game.effect';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: true, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([GameEffects]),
  ],
  providers: [GameService, DbService],
  bootstrap: [AppComponent],
})
export class AppModule {}
