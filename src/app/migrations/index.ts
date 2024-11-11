// index.ts
import * as init from './init.migration';
import { Migration } from 'kysely';

const migrations: Migration[] = [
  init
];

export default migrations;
