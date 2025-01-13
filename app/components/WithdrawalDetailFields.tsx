import { Controller, useFormContext } from 'react-hook-form';
import { Label } from './ui/label';
import { Input } from './ui/input';
import type { FireflyTransaction } from '@/lib/entities';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';

const WithdrawalDetailFields = () => {
  const { watch, register, control } = useFormContext<FireflyTransaction>();
  const fields = watch();
  return (
    <>
      <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Categoria</p>
          <p className="text-sm text-muted-foreground">{fields.category_id}</p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Cuenta de gasto</p>
          <p className="text-sm text-muted-foreground">
            {fields.destination_id}
          </p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Cuenta de retiro</p>
          <p className="text-sm text-muted-foreground">{fields.source_id}</p>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (!date) return;
                      onChange(date.toISOString());
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción de la transacción</Label>
        <Input type="text" {...register('description', { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Cantidad</Label>
        <Input type="number" {...register('amount', { required: true })} />
      </div>
    </>
  );
};

export default WithdrawalDetailFields;
