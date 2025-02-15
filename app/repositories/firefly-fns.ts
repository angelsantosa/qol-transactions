import * as v from 'valibot';
import { createServerFn } from '@tanstack/start';
import { queryOptions } from '@tanstack/react-query';
import {
  createFireflyTransaction,
  fetchFireFlyAccounts,
  fetchFireflyCategories,
} from './firefly-services';
import {
  FireflyAccountTypeSchema,
  type FireflyTransaction,
  FireflyTransactionSchema,
  type FireflyAccountType,
} from '@/lib/entities';

export const fetchCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    const fireflyCategories = await fetchFireflyCategories();

    return fireflyCategories.data;
  },
);

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

export const fetchAccounts = createServerFn({ method: 'GET' })
  .validator((type: unknown) => v.parse(FireflyAccountTypeSchema, type))
  .handler(async ({ data: type }) => {
    const fireflyAccounts = await fetchFireFlyAccounts({ type });
    return fireflyAccounts.data;
  });

export const accountsQueryOptions = ({ type }: { type: FireflyAccountType }) =>
  queryOptions({
    queryKey: ['accounts', type],
    queryFn: () => fetchAccounts({ data: type }),
  });

export const createTransaction = createServerFn({ method: 'POST' })
  .validator((transaction: FireflyTransaction) =>
    v.parse(FireflyTransactionSchema, transaction),
  )
  .handler(async ({ data: transaction }) => {
    await createFireflyTransaction(transaction);
  });
