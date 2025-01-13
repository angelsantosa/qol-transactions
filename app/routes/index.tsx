import { createFileRoute } from '@tanstack/react-router';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import {
  accountsQueryOptions,
  categoriesQueryOptions,
} from '@/repositories/firefly-fns';
import { categorySettingsQueryOptions } from '@/repositories/categories-fns';
import WithdrawalCategoryField from '@/components/WithdrawalCategoryField';
import WithdrawalExpenseAccountField from '@/components/WithdrawalExpenseAccountField';
import WithdrawalAssetAccountField from '@/components/WithdrawalAssetAccountField';
import WithdrawalDetailFields from '@/components/WithdrawalDetailFields';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    const categoriesQuery = context.queryClient.ensureQueryData(
      categoriesQueryOptions(),
    );
    const expenseAccountsQuery = context.queryClient.ensureQueryData(
      accountsQueryOptions({ type: 'expense' }),
    );
    const assetAccountsQuery = context.queryClient.ensureQueryData(
      accountsQueryOptions({ type: 'asset' }),
    );
    const categorySettingsQuery = context.queryClient.ensureQueryData(
      categorySettingsQueryOptions(),
    );

    await Promise.all([
      categoriesQuery,
      expenseAccountsQuery,
      assetAccountsQuery,
      categorySettingsQuery,
    ]);
  },
});

type FormData = {
  amount: string;
  category: string;
  withdrawal_account: string;
  expense_account: string;
  description: string;
};

function Home() {
  const form = useForm<FormData>({});
  const { watch, handleSubmit } = form;

  const fields = watch();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl">Nuevo gasto</h2>
        {!fields.category ? <WithdrawalCategoryField /> : null}
        {!fields.expense_account && fields.category ? (
          <WithdrawalExpenseAccountField />
        ) : null}
        {!fields.withdrawal_account && fields.expense_account ? (
          <WithdrawalAssetAccountField />
        ) : null}
        {fields.withdrawal_account ? <WithdrawalDetailFields /> : null}
      </form>
    </FormProvider>
  );
}
