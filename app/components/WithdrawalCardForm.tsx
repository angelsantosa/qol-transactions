// External packages
import React from "react";
import { format } from "date-fns";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { CalendarIcon, FolderOpenDot, Loader2, Sparkles } from "lucide-react";
// UI Components
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import CurrencyInput from "./InputCurrency";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// Internal absolute imports
import type { FireflyTransaction } from "@/lib/entities";
import { cn, formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  accountsQueryOptions,
  categoriesQueryOptions,
  createTransaction,
} from "@/repositories/firefly-fns";
import { generateDescription } from "@/repositories/llm-fns";
import { categorySettingsQueryOptions } from "@/repositories/categories-fns";

const WithdrawalCardForm = () => {
  const { queryClient } = useRouteContext({ from: "__root__" });
  const { toast } = useToast();

  const [createAnother, setCreateAnother] = React.useState(false);

  const form = useForm<FireflyTransaction>({
    defaultValues: {
      type: "withdrawal",
      date: new Date().toISOString(),
      category_id: "",
      destination_id: "",
      source_id: "",
      amount: "",
      description: "",
    },
  });

  const { formState } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast({
        title: "Transacción creada",
        variant: "default",
        description: "La transacción ha sido creada correctamente",
      });
      if (createAnother) {
        form.setValue("amount", "");
        form.trigger();
      } else {
        form.reset();
      }
      queryClient.invalidateQueries(accountsQueryOptions({ type: "asset" }));
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<FireflyTransaction> = (data) => {
    // remove time from date
    const date = new Date(data.date);
    data.date = date.toISOString().split("T")[0];
    mutate({ data });
  };

  const fields = form.watch();

  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const { data: assetAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: "asset" })
  );
  const { data: expenseAccounts } = useSuspenseQuery(
    accountsQueryOptions({ type: "expense" })
  );

  const { data: categorySettings } = useSuspenseQuery(
    categorySettingsQueryOptions()
  );

  const { mutate: genDescription, isPending: isGeneratingDescription } =
    useMutation({
      mutationFn: generateDescription,
      onSuccess: (description) => {
        form.setValue("description", description, { shouldValidate: true });
      },
    });

  const categorySettingsIds = categorySettings.map((setting) => setting.id);

  const expenseAccountsFiltered = React.useMemo(() => {
    if (!fields.category_id || categorySettingsIds.length === 0)
      return expenseAccounts;

    const foundCategory = categorySettings.find(
      (setting) => setting.id === fields.category_id
    );

    if (!foundCategory) return expenseAccounts;

    const assignedAccounts = foundCategory.expense_accounts.map(
      (account) => account.object_id
    );

    return expenseAccounts.filter((account) =>
      assignedAccounts.includes(account.id)
    );
  }, [
    expenseAccounts,
    categorySettings,
    categorySettingsIds,
    fields.category_id,
  ]);

  const currentCategory = categories?.find(
    (category) => category.id === fields.category_id
  );

  const currentAssetAccount = assetAccounts?.find(
    (account) => account.id === fields.source_id
  );

  const currentExpenseAccount = expenseAccounts?.find(
    (account) => account.id === fields.destination_id
  );

  const currentAmountWithdrawal = Number(fields.amount);

  const assetBalanceNumber = Number(
    currentAssetAccount?.attributes.current_balance
  );
  const assetAmountBeforeWithdrawal =
    assetBalanceNumber - currentAmountWithdrawal;

  const currentAmountWithdrawalFormatted = formatCurrency({
    amount: currentAmountWithdrawal,
    currency: currentAssetAccount?.attributes.currency_code,
  });

  const assetAmountBeforeWithdrawalFormatted = formatCurrency({
    amount: assetAmountBeforeWithdrawal,
    currency: currentAssetAccount?.attributes.currency_code,
  });

  const assetAccountBalance = formatCurrency({
    amount: assetBalanceNumber,
    currency: currentAssetAccount?.attributes.currency_code,
  });

  const disableGenerateDescription =
    !currentCategory || !currentAssetAccount || !currentExpenseAccount;

  const handleGenerateDescription = () => {
    if (disableGenerateDescription) return;

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
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Nuevo gasto</CardTitle>
          {/* <CardDescription>Verifica la información</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Controller
                name="category_id"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => {
                  const { ref: _ref, ...restField } = field;
                  return (
                    <Select
                      {...restField}
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("destination_id", "", {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={`category-${category.id}`}
                            value={category.id}
                          >
                            <div className="flex gap-2 justify-center items-center">
                              <FolderOpenDot size={16} />{" "}
                              <span>{category.attributes.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Cuenta de gasto</Label>
              <Controller
                name="destination_id"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => {
                  const { ref: _ref, ...restField } = field;
                  return (
                    <Select
                      {...restField}
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={!fields.category_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una cuenta de gasto" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseAccountsFiltered.map((expense_account) => (
                          <SelectItem
                            key={`expense-account-${expense_account.id}`}
                            value={expense_account.id}
                          >
                            <div className="flex gap-2 justify-center items-center">
                              <FolderOpenDot size={16} />{" "}
                              <span>{expense_account.attributes.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Cuenta de retiro</Label>
              <Controller
                name="source_id"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => {
                  const { ref: _ref, ...restField } = field;
                  return (
                    <Select
                      {...restField}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una cuenta de retiro" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetAccounts.map((asset_account) => (
                          <SelectItem
                            key={`asset-account-${asset_account.id}`}
                            value={asset_account.id}
                          >
                            <div className="flex gap-2 justify-center items-center">
                              <FolderOpenDot size={16} />{" "}
                              <span>{asset_account.attributes.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {currentAssetAccount ? (
                <p className="text-sm">
                  Cantidad disponible:{" "}
                  <span className="font-bold">{assetAccountBalance}</span>
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Fecha de la transacción</Label>
              <Controller
                control={form.control}
                name="date"
                render={({ field: { onChange, value } }) => {
                  const date = new Date(value);
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date </span>
                          )}
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
              <Label htmlFor="description">
                {" "}
                Descripción de la transacción{" "}
              </Label>
              <div className="flex relative items-center w-full">
                <Input
                  disabled={isGeneratingDescription}
                  type="text"
                  {...form.register("description", { required: true })}
                  className="pe-12"
                />
                <Button
                  type="button"
                  variant={"ghost"}
                  className="absolute inset-y-0 end-0"
                  disabled={
                    disableGenerateDescription || isGeneratingDescription
                  }
                  onClick={handleGenerateDescription}
                >
                  {isGeneratingDescription ? (
                    <Loader2 className="w-2 h-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-2 h-2" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount"> Cantidad </Label>
              <Controller
                control={form.control}
                name="amount"
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <CurrencyInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  );
                }}
              />
              {fields.amount && currentAssetAccount ? (
                <div className="text-sm">
                  Nuevo saldo en{" "}
                  <span className="font-bold text-primary">
                    {currentAssetAccount.attributes.name}
                  </span>
                  :{" "}
                  <span className="font-bold">
                    {assetAmountBeforeWithdrawalFormatted}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                form.reset();
                form.trigger();
              }}
              type="button"
              variant="secondary"
            >
              Reiniciar
            </Button>
          </div>

          <div className="flex flex-col gap-4">
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
            <Button
              disabled={
                !formState.isValid || isPending || isGeneratingDescription
              }
              type="submit"
            >
              Crear transacción
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default WithdrawalCardForm;
