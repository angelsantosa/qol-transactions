import { Controller, useFormContext } from 'react-hook-form';
import { Label } from './ui/label';
import { Input } from './ui/input';
import type { FireflyTransaction } from '@/lib/entities';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import {
  accountsQueryOptions,
  categoriesQueryOptions,
} from '@/repositories/firefly-fns';
import { generateDescription } from '@/repositories/llm-fns';

const WithdrawalDetailFields = () => {
  const { watch, register, control, setValue } =
    useFormContext<FireflyTransaction>();
  const fields = watch();

  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const { data: assetAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: 'asset' }),
  );
  const { data: expenseAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: 'expense' }),
  );

  const { mutate: genDescription, isPending: isGeneratingDescription } =
    useMutation({
      mutationFn: generateDescription,
      onSuccess: (description) => {
        setValue('description', description, { shouldValidate: true });
      },
    });

  const currentCategory = categories?.find(
    (category) => category.id === fields.category_id,
  );

  const currentAssetAccount = assetAccounts?.find(
    (account) => account.id === fields.source_id,
  );

  const currentExpenseAccount = expenseAccounts?.find(
    (account) => account.id === fields.destination_id,
  );

  if (!currentCategory || !currentAssetAccount || !currentExpenseAccount)
    return null;

  const currentAmountWithdrawal = Number(fields.amount);

  const currentAmountWithdrawalFormatted = `${new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currentAssetAccount.attributes.currency_code,
  }).format(currentAmountWithdrawal)}`;

  const assetBalanceNumber = Number(
    currentAssetAccount.attributes.current_balance,
  );

  const assetAmountBeforeWithdrawal =
    assetBalanceNumber - currentAmountWithdrawal;

  const assetAmountBeforeWithdrawalFormatted = `${new Intl.NumberFormat(
    'es-MX',
    {
      style: 'currency',
      currency: currentAssetAccount.attributes.currency_code,
    },
  ).format(
    assetAmountBeforeWithdrawal,
  )} ${currentAssetAccount.attributes.currency_code}`;

  // const expenseAmountBeforeWithdrawal =
  //   expenseBalanceNumber + currentAmountWithdrawal;

  const assetAccountBalance = `${new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currentAssetAccount.attributes.currency_code,
  }).format(
    assetBalanceNumber,
  )} ${currentAssetAccount.attributes.currency_code}`;

  return (
    <>
      <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
        <span className="flex w-2 h-2 rounded-full translate-y-1 bg-primary" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Categoria</p>
          <p className="text-sm text-muted-foreground">
            {currentCategory.attributes.name}
          </p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
        <span className="flex w-2 h-2 rounded-full translate-y-1 bg-primary" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Cuenta de gasto</p>
          <p className="text-sm text-muted-foreground">
            {`${currentExpenseAccount.attributes.name}`}
          </p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
        <span className="flex w-2 h-2 rounded-full translate-y-1 bg-primary" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Cuenta de retiro</p>
          <p className="text-sm text-muted-foreground">
            {`${currentAssetAccount.attributes.name} - Disponible: ${assetAccountBalance}`}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Fecha de la transacción</Label>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => {
            const date = new Date(value);
            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (!date) return;
                      onChange(date.toISOString());
                    }}
                    initialFocus
                    toDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción de la transacción</Label>
        <div className="flex items-center w-full">
          <Input
            disabled={isGeneratingDescription}
            type="text"
            {...register('description', { required: true })}
          />
          <Button
            type="button"
            variant={'ghost'}
            disabled={!fields.description || isGeneratingDescription}
            onClick={() => {
              setValue('description', '', {
                shouldValidate: true,
              });
              genDescription({
                data: {
                  date: fields.date,
                  amount: currentAmountWithdrawalFormatted,
                  category: currentCategory.attributes.name,
                  assetAccount: currentAssetAccount.attributes.name,
                  expenseAccount: currentExpenseAccount.attributes.name,
                  description: fields.description,
                },
              });
            }}
          >
            <Sparkles className="w-2 h-2" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Cantidad</Label>
        <Input type="number" {...register('amount', { required: true })} />
        {fields.amount ? (
          <div className="text-sm text-muted-foreground">
            Nuevo saldo en{' '}
            <span className="font-bold">
              {currentAssetAccount.attributes.name}
            </span>
            : {assetAmountBeforeWithdrawalFormatted}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default WithdrawalDetailFields;
