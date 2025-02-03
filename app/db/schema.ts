import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categorySettingsTable = sqliteTable("category_settings", {
  id: text("id").primaryKey(),
  expense_accounts: text("expense_accounts", {
    mode: "json",
  }),
  order: integer("order"),
  lucide_icon: text("lucide_icon", {
    mode: "text",
  }),
});

export type InsertCategorySetting = typeof categorySettingsTable.$inferInsert;
export type SelectCategorySetting = typeof categorySettingsTable.$inferSelect;
