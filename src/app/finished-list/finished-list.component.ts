import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Levels } from '../commons/const/levels';
import { Game } from '../commons/interfaces/game';
import { MillisecondsPipe } from '../commons/pipes/milliseconds.pipe';
import { GameFbService } from '../commons/services/game-fb.service';

@Component({
  selector: 'app-finished-list',
  templateUrl: './finished-list.component.html',
  standalone: true,
  imports: [CommonModule, MillisecondsPipe],
})
export class FinishedListComponent {
  games: Game[] = [];

  constructor(private gameFbService: GameFbService) {}

  ngOnInit(): void {
    this.gameFbService
      .getGames()
      .pipe(
        map((games) =>
          games.sort(
            (a, b) =>
              a.spentTime - b.spentTime ||
              this.getLevel(a.difficulty)!.id - this.getLevel(b.difficulty)!.id
          )
        )
      )
      .subscribe((games) => {
        this.games = games;
      });
  }

  getLevel(description: string) {
    return Levels.find((l) => l.name === description);
  }
}
