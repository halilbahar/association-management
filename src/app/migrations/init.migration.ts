import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('MemberTable')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .execute();

  await db.schema
    .createTable('MemberDataTable')
    .addColumn('memberId', 'integer', (col) =>
      col.references('MemberTable.id').onDelete('cascade')
    )
    .addColumn('firstName', 'varchar', (col) => col.notNull())
    .addColumn('lastName', 'varchar', (col) => col.notNull())
    .addColumn('birthDate', 'date', (col) => col.notNull())
    .addColumn('joinedDate', 'date', (col) => col.notNull())
    .addColumn('gender', 'varchar', (col) => col.notNull())
    .addColumn('nationality', 'varchar', (col) => col.notNull())
    .addColumn('notes', 'text')
    .addColumn('emails', 'json', (col) => col.notNull())
    .addColumn('addresses', 'json', (col) => col.notNull())
    .addColumn('phoneNumbers', 'json', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('MemberDataTable').execute();
  await db.schema.dropTable('MemberTable').execute();
}
