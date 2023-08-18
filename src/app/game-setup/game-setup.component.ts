import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { GameBoardComponent } from '../game-board/game-board.component';
import { AppState } from '../store/app.reducer';
import { LoadGameSetupSuccess } from '../store/game-setup/game-setup.actions';

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, GameBoardComponent],
})
export class GameSetupComponent {
  frmSetup!: FormGroup;
  levels = [
    { id: 1, name: 'Facil', value: 10 },
    { id: 2, name: 'Medio', value: 5 },
    { id: 3, name: 'Dificil', value: 2 },
  ];
  showBoard = false;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.frmSetup = this.formBuilder.nonNullable.group({
      columns: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
        ],
      ],
      rows: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
        ],
      ],
      level: [null, [Validators.required]],
    });
    this.store
      .select('gameSetupStore')
      .pipe(takeUntilDestroyed())
      .subscribe(({ loaded, data }) => {
        if (loaded && data) this.showBoard = true;
        else this.showBoard = false;
      });
  }

  onSubmit() {
    this.store.dispatch(
      LoadGameSetupSuccess({
        gameSetup: {
          ...this.frmSetup.value,
          levelDescription: this.levels.find(
            (l) => l.value === this.frmSetup.value.level
          )?.name,
          startTime: new Date(),
          endTime: null,
        },
      })
    );
    this.showBoard = true;
    this.frmSetup.reset();
  }
}
