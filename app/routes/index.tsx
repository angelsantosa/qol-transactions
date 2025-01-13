import { createFileRoute } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioButton } from '@/components/ui/radio-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import {
  accountsQueryOptions,
  categoriesQueryOptions,
} from '@/repositories/firefly-fns';
import { useSuspenseQuery } from '@tanstack/react-query';

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

    await Promise.all([
      categoriesQuery,
      expenseAccountsQuery,
      assetAccountsQuery,
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
  const { register, control, watch, handleSubmit } = useForm<FormData>({});

  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const { data: expenseAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: 'expense' }),
  );
  const { data: assetAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: 'asset' }),
  );

  const fields = watch();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl">Nuevo gasto</h2>
      <div className="space-y-3">
        <Label htmlFor="category">Categoria</Label>
        <Controller
          name="category"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <div className="grid grid-cols-3 gap-4">
                {categories.map((category) => (
                  <RadioButton
                    key={category.id}
                    active={field.value === category.attributes.name}
                    onClick={() => {
                      field.onChange(category.attributes.name);
                    }}
                    icon={<CreditCard />}
                    value={category.attributes.name}
                    name="category"
                  />
                ))}
              </div>
            );
          }}
        />
      </div>
      <div className="space-y-3">
        <div>
          <Label htmlFor="category">Cuenta de gastos</Label>
          <p className="text-sm text-muted-foreground">
            {'Hace referencia a la la entidad que recibe el gasto.'}
          </p>
        </div>
        <Controller
          name="expense_account"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <div className="grid grid-cols-3 gap-4">
                {expenseAccounts.map((account) => (
                  <RadioButton
                    key={account.id}
                    active={field.value === account.attributes.name}
                    onClick={() => {
                      field.onChange(account.attributes.name);
                    }}
                    icon={<CreditCard />}
                    value={account.attributes.name}
                    name="expense_account"
                  />
                ))}
              </div>
            );
          }}
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="withdrawal_account">Cuenta de retiro</Label>
          <p className="text-sm text-muted-foreground">
            {'Hace referencia a la cuenta que hizo el retiro.'}
          </p>
        </div>
        <Controller
          name="withdrawal_account"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <div ref={field.ref} className="flex gap-2 flex-col">
                {assetAccounts.map((account) => (
                  <RadioButton
                    key={account.id}
                    active={field.value === account.attributes.name}
                    onClick={() => {
                      field.onChange(account.attributes.name);
                    }}
                    icon={<CreditCard />}
                    value={account.attributes.name}
                    orientation="horizontal"
                    name="withdrawal_account"
                  />
                ))}
              </div>
            );
          }}
        />
      </div>

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Verifica la información</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Categoria</p>
              <p className="text-sm text-muted-foreground">{fields.category}</p>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Cuenta de gasto
              </p>
              <p className="text-sm text-muted-foreground">
                {fields.expense_account}
              </p>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Cuenta de retiro
              </p>
              <p className="text-sm text-muted-foreground">
                {fields.withdrawal_account}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad</Label>
            <Input type="number" {...register('amount', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción de la transacción</Label>
            <Input
              type="text"
              {...register('description', { required: true })}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Guarda información</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
