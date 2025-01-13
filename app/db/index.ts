import { drizzle } from 'drizzle-orm/libsql';

export const getDb = () => {
  return drizzle({
    connection: {
      url: process.env.DATABASE_URL ?? '',
      authToken: process.env.DATABASE_AUTH_TOKEN ?? '',
    },
  });
};
