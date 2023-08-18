import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Game } from '../commons/interfaces/game';
import { GameService } from '../commons/services/game.service';

@Component({
  selector: 'app-finished-list',
  templateUrl: './finished-list.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class FinishedListComponent {
  games: Game[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.loadGames();
    this.gameService.games$.subscribe((games) => {
      this.games = games;
      console.log(this.games);
    });
  }
}
