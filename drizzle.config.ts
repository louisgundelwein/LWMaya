import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();		

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('No DATABASE_URL provided');
export default {
	schema: './src/db/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString,
	},
} satisfies Config;
