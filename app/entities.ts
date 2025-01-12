import * as v from 'valibot';
import { createFireflyListSchema } from './lib/utils';

export const FireflyAccountTypeSchema = v.union([
  v.literal('asset'),
  v.literal('expense'),
  v.literal('import'),
  v.literal('revenue'),
  v.literal('cash'),
  v.literal('liability'),
  v.literal('liabilities'),
  v.literal('initial-balance'),
  v.literal('reconciliation'),
]);

export type FireflyAccountType = v.InferOutput<typeof FireflyAccountTypeSchema>;

export const FireflyLiabilityDirectionSchema = v.union([
  v.literal('credit'),
  v.literal('debit'),
  v.null(),
]);

export const FireflyCategorySchema = createFireflyListSchema(
  v.object({
    notes: v.nullable(v.string()),
    spent: v.array(
      v.object({
        currency_id: v.string(),
        currency_code: v.string(),
        currency_symbol: v.string(),
        currency_decimal_places: v.number(),
        sum: v.string(),
      }),
    ),
    earned: v.array(
      v.object({
        currency_id: v.string(),
        currency_code: v.string(),
        currency_symbol: v.string(),
        currency_decimal_places: v.number(),
        sum: v.string(),
      }),
    ),
  }),
);

export type FireflyCategory = v.InferOutput<typeof FireflyCategorySchema>;

export const FireflyAccountListSchema = createFireflyListSchema(
  v.object({
    type: FireflyAccountTypeSchema,
    active: v.boolean(),
    order: v.nullable(v.number()),
    currency_code: v.string(),
    currency_symbol: v.string(),
    current_balance: v.string(),
    current_balance_date: v.string(),
    opening_balance: v.string(),
    current_debt: v.nullable(v.string()),
    virtual_balance: v.string(),
    liability_type: v.nullable(v.string()),
    liability_direction: v.nullable(FireflyLiabilityDirectionSchema),
    notes: v.nullable(v.string()),
  }),
);

export type FireflyAccountList = v.InferOutput<typeof FireflyAccountListSchema>;
