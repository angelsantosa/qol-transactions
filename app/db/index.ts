import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
config({ path: '.env' }); // or .env.local

export const getDb = () => {
  return drizzle({
    connection: {
      url: process.env.DATABASE_URL ?? '',
      authToken: process.env.DATABASE_AUTH_TOKEN ?? '',
    },
  });
};
