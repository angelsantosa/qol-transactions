import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  setCategoryAccounts,
  settingsQueryKey,
  type SetCategoryAccounts,
} from '@/repositories/categories-fns';
import { accountsQueryOptions } from '@/repositories/firefly-fns';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Trash2Icon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouteContext } from '@tanstack/react-router';
import type { GenericObject } from '@/lib/utils';

const CategoryAccountsForm: React.FC<SetCategoryAccounts> = (props) => {
  const { queryClient } = useRouteContext({ from: '__root__' });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<SetCategoryAccounts>({
    defaultValues: props,
  });
  const { toast } = useToast();

  const { fields, append, remove } = useFieldArray<SetCategoryAccounts>({
    control,
    name: 'expense_accounts',
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: setCategoryAccounts,
    onMutate: async ({ data }) => {
      const expectedCategorySetting = {
        id: data.category_id,
        expense_accounts: data.expense_accounts,
      };

      await queryClient.cancelQueries({
        queryKey: settingsQueryKey.category(),
      });

      const previousSettings = queryClient.getQueryData<
        Array<{
          id: string;
          expense_accounts: Array<GenericObject>;
        }>
      >(settingsQueryKey.category());

      queryClient.setQueryData<
        Array<{
          id: string;
          expense_accounts: Array<GenericObject>;
        }>
      >(settingsQueryKey.category(), (old) => {
        if (!old) return [expectedCategorySetting];

        const categorySettingIndex = old.findIndex(
          (setting) => setting.id === expectedCategorySetting.id,
        );

        if (!categorySettingIndex) return [...old, expectedCategorySetting];

        old[categorySettingIndex] = {
          ...old[categorySettingIndex],
          expense_accounts: expectedCategorySetting.expense_accounts,
        };

        return old;
      });

      return { previousSettings };
    },
    onSuccess: (_d, { data }) => {
      reset(data, { keepDirty: false });
      toast({
        title: 'Categoría actualizada',
        variant: 'default',
        description: 'La categoría ha sido actualizada correctamente',
      });
    },
    onError: (error, _newTodo, context) => {
      queryClient.setQueryData(settingsQueryKey.category(), context);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKey.category() });
    },
  });

  const onSubmit: SubmitHandler<SetCategoryAccounts> = (data) => {
    mutate({
      data,
    });
  };

  const { data: accounts } = useSuspenseQuery(
    accountsQueryOptions({ type: 'expense' }),
  );

  const expenseAccountsFormIds = new Set(
    fields.map((field) => field.object_id),
  );

  const accountsRecord = accounts.reduce<
    Record<string, (typeof accounts)[number]>
  >((acc, account) => {
    acc[account.id] = account;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="flex justify-between items-center gap-2">
          <h4 className="text-sm font-bold">Jerarquia</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="secondary" size="sm">
                Agregar cuenta
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-48 overflow-y-auto">
              {accounts.map((account) => {
                const isSelected = expenseAccountsFormIds.has(account.id);
                if (isSelected) return null;
                return (
                  <DropdownMenuItem
                    onClick={() =>
                      append({
                        object_id: account.id,
                      })
                    }
                    key={account.id}
                  >
                    {account.attributes.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>Cuentas relacionadas.</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2"
          id="category_accounts_form"
        >
          {fields.length === 0 ? (
            <div className="text-sm text-gray-500">
              No hay cuentas relacionadas.
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {fields.map((field, index) => {
              const account = accountsRecord[field.object_id];
              return (
                <Badge variant={'outline'} className="pr-0" key={field.id}>
                  <div className="flex items-center justify-between gap-1">
                    <div className="select-none">{account.attributes.name}</div>
                    <Button
                      type="button"
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => remove(index)}
                    >
                      <Trash2Icon className="w-1 h-1 text-red-600" />
                    </Button>
                  </div>
                </Badge>
              );
            })}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        {isDirty ? (
          <>
            <Button
              type="button"
              onClick={() => reset(props)}
              variant="outline"
            >
              Cancelar / Restablecer
            </Button>
            <Button
              disabled={!isValid || isPending}
              type="submit"
              form="category_accounts_form"
            >
              Guardar
            </Button>
          </>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default CategoryAccountsForm;
