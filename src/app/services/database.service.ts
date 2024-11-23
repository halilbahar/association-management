import { Injectable } from '@angular/core';
import { Database } from '~models/database-types';
import { Kysely, Migration, MigrationProvider, Migrator, SqliteDialect } from 'kysely';
import migrations from '../migrations';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  readonly kysely: Kysely<Database>;

  constructor() {
    const SQLite = require('better-sqlite3');
    const dialect = new SqliteDialect({
      // database: new SQLite(':memory:', { verbose: console.log })
      database: new SQLite('/home/halil/projects/association-management/db')
    });
    this.kysely = new Kysely<Database>({ dialect });
  }

  async migrate(): Promise<void> {
    const migrator = new Migrator({
      db: this.kysely,
      provider: new ArrayMigrationsProvider(migrations)
    });

    try {
      const { error, results } = await migrator.migrateToLatest();
      if (error) {
        console.error('Migration failed:', error);
      } else {
        console.log('Migrations successful:', results);
      }
    } catch (error) {
      console.error('Error running migrations:', error);
    }
  }
}

export class ArrayMigrationsProvider implements MigrationProvider {
  private readonly migrations: Record<string, Migration>;

  constructor(migrations: Migration[]) {
    this.migrations = migrations.reduce<Record<string, Migration>>((acc, item, index) => {
      acc[index.toString()] = item;
      return acc;
    }, {});
  }

  async getMigrations(): Promise<Record<string, Migration>> {
    return this.migrations;
  }
}
