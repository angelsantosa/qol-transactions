import { Controller, useFormContext } from 'react-hook-form';
import { Label } from './ui/label';
import { RadioButton } from './ui/radio-button';
import React from 'react';
import { categorySettingsQueryOptions } from '@/repositories/categories-fns';
import { useSuspenseQuery } from '@tanstack/react-query';
import { accountsQueryOptions } from '@/repositories/firefly-fns';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import type { FireflyTransaction } from '@/lib/entities';

const WithdrawalExpenseAccountField = () => {
  const { control, watch, setValue } = useFormContext<FireflyTransaction>();
  const categoryIdField = watch('category_id');

  const { data: expenseAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: 'expense' }),
  );
  const { data: categorySettings } = useSuspenseQuery(
    categorySettingsQueryOptions(),
  );
  const categorySettingsIds = categorySettings.map((setting) => setting.id);

  const expenseAccountsFiltered = React.useMemo(() => {
    if (!categoryIdField || categorySettingsIds.length === 0)
      return expenseAccounts;

    const foundCategory = categorySettings.find(
      (setting) => setting.id === categoryIdField,
    );

    if (!foundCategory) return expenseAccounts;

    const assignedAccounts = foundCategory.expense_accounts.map(
      (account) => account.object_id,
    );

    return expenseAccounts.filter((account) =>
      assignedAccounts.includes(account.id),
    );
  }, [expenseAccounts, categorySettings, categorySettingsIds, categoryIdField]);

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="category">Cuenta de gastos</Label>
        <p className="text-sm text-muted-foreground">
          {'Hace referencia a la la entidad que recibe el gasto.'}
        </p>
      </div>
      <Controller
        name="destination_id"
        control={control}
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <div className="grid grid-cols-3 gap-4">
              {expenseAccountsFiltered.map((account) => (
                <RadioButton
                  key={account.id}
                  active={field.value === account.id}
                  onClick={() => {
                    field.onChange(account.id);
                  }}
                  icon={<CreditCard />}
                  value={account.attributes.name}
                />
              ))}
            </div>
          );
        }}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setValue('category_id', '');
          }}
          variant="link"
          className="mt-2"
        >
          <ArrowLeft /> Regresar
        </Button>
      </div>
    </div>
  );
};

export default WithdrawalExpenseAccountField;
