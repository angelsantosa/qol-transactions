import { Controller, useFormContext } from 'react-hook-form';
import { Label } from './ui/label';
import { RadioButton } from './ui/radio-button';
import React from 'react';
import { categorySettingsQueryOptions } from '@/repositories/categories-fns';
import { useSuspenseQuery } from '@tanstack/react-query';
import { accountsQueryOptions } from '@/repositories/firefly-fns';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from './ui/button';

const WithdrawalExpenseAccountField = () => {
  const { control, watch, setValue } = useFormContext();
  const categoryField = watch('category');

  const { data: expenseAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: 'expense' }),
  );
  const { data: categorySettings } = useSuspenseQuery(
    categorySettingsQueryOptions(),
  );
  const categorySettingsIds = categorySettings.map((setting) => setting.id);

  const expenseAccountsFiltered = React.useMemo(() => {
    if (!categoryField || categorySettingsIds.length === 0)
      return expenseAccounts;

    const foundCategory = categorySettings.find(
      (setting) => setting.id === categoryField,
    );

    if (!foundCategory) return expenseAccounts;

    const assignedAccounts = foundCategory.expense_accounts.map(
      (account) => account.object_id,
    );

    return expenseAccounts.filter((account) =>
      assignedAccounts.includes(account.id),
    );
  }, [expenseAccounts, categorySettings, categorySettingsIds, categoryField]);

  return (
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
              {expenseAccountsFiltered.map((account) => (
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
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setValue('category', null);
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
