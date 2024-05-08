
//add schema here
//get type of schema with: type SchemaType = typeof schema.$ inferSelect or type NewSchemaType = typeof schema.$ inferInsert

import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const vehicle = pgTable('vehicle', {
	id: serial('id').primaryKey(),
	name: text('name'),
});

//  db:generate: drizzle-kit generate:pg,
//  db:drop: drizzle-kit drop,
//  db:migrate: tsx ./src/db/migrate.ts,
//  db:push: drizzle-kit push:pg,
//  db:studio: drizzle-kit studio,

		
