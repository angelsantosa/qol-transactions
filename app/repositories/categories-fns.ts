import * as v from 'valibot';
import { createServerFn } from '@tanstack/start';
import { db } from '@/db';
import { categorySettingsTable } from '@/db/schema';
import { GenericObjectSchema } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const settingsQueryKey = {
  all: () => ['settings'],
  category: () => [...settingsQueryKey.all(), 'category'],
};

const fetchCategorySettings = createServerFn({ method: 'GET' }).handler(
  async () => {
    const settings = await db.select().from(categorySettingsTable);
    return settings.map((s) => {
      const parse = v.safeParse(
        v.array(GenericObjectSchema),
        s.expense_accounts,
      );
      const expense_accounts = parse.success ? parse.output : [];
      return {
        ...s,
        expense_accounts,
      };
    });
  },
);

const SetCategoryAccountsSchema = v.object({
  category_id: v.string(),
  expense_accounts: v.array(GenericObjectSchema),
});

export type SetCategoryAccounts = v.InferOutput<
  typeof SetCategoryAccountsSchema
>;

export const setCategoryAccounts = createServerFn({
  method: 'POST',
})
  .validator((params: SetCategoryAccounts) =>
    v.parse(SetCategoryAccountsSchema, params),
  )
  .handler(async ({ data: { category_id, expense_accounts } }) => {
    await db
      .insert(categorySettingsTable)
      .values({
        id: category_id,
        expense_accounts,
      })
      .onConflictDoUpdate({
        target: [categorySettingsTable.id],
        set: { id: category_id, expense_accounts },
      });
  });

export const categorySettingsQueryOptions = () =>
  queryOptions({
    queryKey: settingsQueryKey.category(),
    queryFn: () => fetchCategorySettings(),
  });
