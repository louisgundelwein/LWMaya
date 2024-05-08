import * as dotenv from 'dotenv';
dotenv.config();
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const _databaseUrl = process.env.DATABASE_URL as string;
const databaseUrl = drizzle(postgres(_databaseUrl, { ssl: 'require', max: 1 }));

const main = async () => {
	try {
		await migrate(databaseUrl, { migrationsFolder: 'drizzle' });
		console.log('Migration complete');
	} catch (error) {
		console.log(error);
        }
	process.exit(0);
};

main()
	.then( () => {})
	.catch( () => {console.log('Something went wrong D:')})

