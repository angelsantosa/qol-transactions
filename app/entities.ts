import z from 'zod';

export const accountTypeSchema = z.enum([
  'expense',
  'asset',
  'liability',
  'all',
]);

export type AccountType = z.infer<typeof accountTypeSchema>;

export type FireflyCategories = {
  data: {
    id: string;
    attributes: { name: string };
    links: { self: string };
  }[];
};

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export type FireFlyAccounts = {
  data: {
    id: string;
    attributes: {
      name: string;
      type: AccountType;
      current_balance: string;
      virtual_balance: string;
    };
    links: { self: string };
  }[];
};

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: accountTypeSchema,
  current_balance: z.string(),
  virtual_balance: z.string(),
});

export type Account = z.infer<typeof accountSchema>;
