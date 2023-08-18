import { Injectable } from '@angular/core';
import { RxCollection, RxDatabase, createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { Game } from '../interfaces/game';

@Injectable()
export class DbService {
  private dbPromise: Promise<RxDatabase<Game>>;
  private gamesCollectionPromise: Promise<{
    games: RxCollection<Game, {}, {}, {}>;
  }>;

  constructor() {
    this.dbPromise = this.initDb();
    this.gamesCollectionPromise = this.initGamesCollection();
  }

  private async initDb(): Promise<RxDatabase<any>> {
    const db = await createRxDatabase({
      name: 'gamesdb' + Math.random() * 100, // <- name
      storage: getRxStorageMemory(), // <- RxStorage
      password: 'myPassword', // <- password (optional)
    });
    return db;
  }

  private async initGamesCollection() {
    const db = await this.dbPromise;
    const gamesCollection = await db.addCollections({
      games: {
        schema: {
          title: 'Games schema',
          version: 0,
          primaryKey: 'id',
          type: 'object',
          properties: {
            id: {
              type: 'string',
              maxLength: 100, // <- the primary key must have set maxLength
            },
            startTime: {
              type: 'string',
            },
            endTime: {
              type: 'string',
            },
            difficulty: {
              type: 'string',
            },
            spentTime: {
              type: 'string',
            },
          },
        },
      },
    });
    return gamesCollection;
  }

  async getGamesCollection(): Promise<{
    games: RxCollection<any, {}, {}, {}>;
  }> {
    return this.gamesCollectionPromise;
  }
}
