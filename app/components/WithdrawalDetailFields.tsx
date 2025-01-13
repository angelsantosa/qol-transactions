import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

const WithdrawalDetailFields = () => {
  const { control, watch, register } = useFormContext();
  const fields = watch();
  return (
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
            <p className="text-sm font-medium leading-none">Cuenta de gasto</p>
            <p className="text-sm text-muted-foreground">
              {fields.expense_account}
            </p>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-[15px_1fr] items-start pb-1 last:mb-0 last:pb-0">
          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Cuenta de retiro</p>
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
          <Input type="text" {...register('description', { required: true })} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit">Guarda información</Button>
      </CardFooter>
    </Card>
  );
};

export default WithdrawalDetailFields;
