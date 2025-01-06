import { z } from 'zod';
import { createServerFn } from '@tanstack/start';
import { queryOptions } from '@tanstack/react-query';
import {
  fetchFireFlyAccounts,
  fetchFireflyCategories,
} from './firefly-services';
import {
  type AccountType,
  type FireFlyAccounts,
  type FireflyCategories,
  accountSchema,
  accountTypeSchema,
  categorySchema,
} from '@/entities';

export const fetchCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    const fireflyCategories: FireflyCategories = await fetchFireflyCategories();
    return categorySchema.array().parse(
      fireflyCategories.data.map((fc) => ({
        id: fc?.id,
        name: fc?.attributes.name,
        link: fc?.links.self,
      })),
    );
  },
);

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

export const fetchAccounts = createServerFn({ method: 'GET' })
  .validator(z.object({ type: accountTypeSchema }))
  .handler(async ({ data: params }) => {
    const fireflyAccounts: FireFlyAccounts = await fetchFireFlyAccounts(params);
    return accountSchema.array().parse(
      fireflyAccounts.data.map((fa) => ({
        id: fa.id,
        name: fa.attributes.name,
        type: fa.attributes.type,
        current_balance: fa.attributes.current_balance,
        virtual_balance: fa.attributes.virtual_balance,
      })),
    );
  });

export const accountsQueryOptions = (params: { type: AccountType }) =>
  queryOptions({
    queryKey: ['accounts', params],
    queryFn: () => fetchAccounts({ data: params }),
  });
