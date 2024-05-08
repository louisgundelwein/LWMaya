import * as dotenv from 'dotenv'; 
dotenv.config();
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const _databaseUrl = process.env.DATABASE_URL as string;

const db = drizzle(postgres(_databaseUrl, { ssl: 'require', max: 1 }));
export default db;

