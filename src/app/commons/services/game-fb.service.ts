import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from '../interfaces/game';

@Injectable({
  providedIn: 'root',
})
export class GameFbService {
  constructor(private firestore: Firestore) {}

  addGame(game: Game) {
    const gameRef = collection(this.firestore, 'games');
    return addDoc(gameRef, game);
  }

  getGames(): Observable<Game[]> {
    const gameRef = collection(this.firestore, 'games');
    return collectionData(gameRef) as Observable<Game[]>;
  }
}
