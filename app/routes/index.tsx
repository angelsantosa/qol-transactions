import { createFileRoute } from "@tanstack/react-router";
import {
  accountsQueryOptions,
  categoriesQueryOptions,
} from "@/repositories/firefly-fns";
import { categorySettingsQueryOptions } from "@/repositories/categories-fns";
import WithdrawalCardForm from "@/components/WithdrawalCardForm";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    const categoriesQuery = context.queryClient.ensureQueryData(
      categoriesQueryOptions()
    );
    const expenseAccountsQuery = context.queryClient.ensureQueryData(
      accountsQueryOptions({ type: "expense" })
    );
    const assetAccountsQuery = context.queryClient.ensureQueryData(
      accountsQueryOptions({ type: "asset" })
    );
    const categorySettingsQuery = context.queryClient.ensureQueryData(
      categorySettingsQueryOptions()
    );

    await Promise.all([
      categoriesQuery,
      expenseAccountsQuery,
      assetAccountsQuery,
      categorySettingsQuery,
    ]);
  },
});

function Home() {
  return <WithdrawalCardForm />;
}
