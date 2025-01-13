import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';

export const getDb = () => {
  const client = createClient({
    url: process.env.DATABASE_URL ?? '',
    authToken: process.env.DATABASE_AUTH_TOKEN ?? '',
  });
  return drizzle({ client });
};
