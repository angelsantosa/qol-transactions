import { createFileRoute } from '@tanstack/react-router';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import {
  accountsQueryOptions,
  categoriesQueryOptions,
  createTransaction,
} from '@/repositories/firefly-fns';
import { categorySettingsQueryOptions } from '@/repositories/categories-fns';
import WithdrawalCategoryField from '@/components/WithdrawalCategoryField';
import WithdrawalDestinationField from '@/components/WithdrawalDestinationField';
import WithdrawalSourceField from '@/components/WithdrawalSourceField';
import WithdrawalDetailFields from '@/components/WithdrawalDetailFields';
import type { FireflyTransaction } from '@/lib/entities';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';

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

function Home() {
  const form = useForm<FireflyTransaction>({
    defaultValues: {
      type: 'withdrawal',
      date: new Date().toISOString(),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
  });

  const {
    watch,
    handleSubmit,
    formState: { isValid },
    reset,
  } = form;

  const fields = watch();

  const onSubmit: SubmitHandler<FireflyTransaction> = (data) => {
    console.log(data);
    // mutate({ data });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl">Nuevo gasto</h2>
        {!fields.category_id ? <WithdrawalCategoryField /> : null}
        {!fields.destination_id && fields.category_id ? (
          <WithdrawalDestinationField />
        ) : null}
        {!fields.source_id && fields.destination_id ? (
          <WithdrawalSourceField />
        ) : null}
        {fields.source_id ? (
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>Verifica la información</CardDescription>
            </CardHeader>
            <CardContent>
              <WithdrawalDetailFields />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={() => {
                  reset();
                }}
                type="button"
                variant="secondary"
              >
                Reiniciar
              </Button>
              <Button disabled={!isValid || isPending} type="submit">
                Crear transacción
              </Button>
            </CardFooter>
          </Card>
        ) : null}
      </form>
    </FormProvider>
  );
}
