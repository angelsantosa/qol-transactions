import { Controller, useFormContext } from 'react-hook-form';
import { Label } from './ui/label';
import { useSuspenseQuery } from '@tanstack/react-query';
import { categoriesQueryOptions } from '@/repositories/firefly-fns';
import { CreditCard } from 'lucide-react';
import { RadioButton } from './ui/radio-button';
import type { FireflyTransaction } from '@/lib/entities';

const CategoryWithdrawalField = () => {
  const { control } = useFormContext<FireflyTransaction>();
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());

  return (
    <div className="space-y-3">
      <Label htmlFor="category">Categoria</Label>
      <Controller
        name="category_id"
        control={control}
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <div className="grid grid-cols-3 gap-4">
              {categories.map((category) => (
                <RadioButton
                  key={category.id}
                  active={field.value === category.id}
                  onClick={() => {
                    field.onChange(category.id);
                  }}
                  icon={<CreditCard />}
                  value={category.attributes.name}
                />
              ))}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CategoryWithdrawalField;
