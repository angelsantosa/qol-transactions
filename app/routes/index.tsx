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
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';

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
  const { queryClient } = Route.useRouteContext();
  const { toast } = useToast();

  const [createAnother, setCreateAnother] = React.useState(false);

  const form = useForm<FireflyTransaction>({
    defaultValues: {
      type: 'withdrawal',
      date: new Date().toISOString(),
    },
  });

  const {
    watch,
    handleSubmit,
    formState: { isValid },
    reset,
    trigger,
  } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast({
        title: 'Transacción creada',
        variant: 'default',
        description: 'La transacción ha sido creada correctamente',
      });
      if (createAnother) {
        form.setValue('amount', '');
        form.setValue('description', '');
        trigger();
      } else {
        reset();
      }
      queryClient.invalidateQueries(accountsQueryOptions({ type: 'asset' }));
    },
    onError: (error) => {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error.message,
      });
    },
  });

  const fields = watch();

  const onSubmit: SubmitHandler<FireflyTransaction> = (data) => {
    // remove time from date
    const date = new Date(data.date);
    data.date = date.toISOString().split('T')[0];
    mutate({ data });
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
            <CardFooter className="flex flex-col gap-2 items-start">
              <div className="flex justify-end w-full">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="create-another"
                    checked={createAnother}
                    onCheckedChange={(checked) => setCreateAnother(!!checked)}
                  />
                  <label
                    htmlFor="create-another"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Crear otra igual
                  </label>
                </div>
              </div>
              <div className="flex justify-between w-full">
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
              </div>
            </CardFooter>
          </Card>
        ) : null}
      </form>
    </FormProvider>
  );
}
