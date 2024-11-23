import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('member')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('createdAt', 'date',
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updatedAt', 'date',
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createTable('memberData')
    .addColumn('memberId', 'integer', (col) =>
      col.references('member.id').onDelete('cascade')
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
    .addColumn('createdAt', 'date',
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updatedAt', 'date',
      (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('memberData').execute();
  await db.schema.dropTable('member').execute();
}
