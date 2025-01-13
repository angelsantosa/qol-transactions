import { Controller, useFormContext } from 'react-hook-form';
import { Label } from './ui/label';
import { RadioButton } from './ui/radio-button';
import { useSuspenseQuery } from '@tanstack/react-query';
import { accountsQueryOptions } from '@/repositories/firefly-fns';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import type { FireflyTransaction } from '@/lib/entities';

const WithdrawalAssetAccountField = () => {
  const { control, setValue } = useFormContext<FireflyTransaction>();

  const { data: assetAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: 'asset' }),
  );

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="withdrawal_account">Cuenta de retiro</Label>
        <p className="text-sm text-muted-foreground">
          {'Hace referencia a la cuenta que hizo el retiro.'}
        </p>
      </div>
      <Controller
        name="source_id"
        control={control}
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <div ref={field.ref} className="flex gap-2 flex-col">
              {assetAccounts.map((account) => (
                <RadioButton
                  key={account.id}
                  active={field.value === account.id}
                  onClick={() => {
                    field.onChange(account.id);
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
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setValue('source_id', '');
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

export default WithdrawalAssetAccountField;
