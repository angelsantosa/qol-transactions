import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  setCategoryAccounts,
  setCategoryIcon,
  settingsQueryKey,
  type SetCategoryAccounts,
} from "@/repositories/categories-fns";
import { accountsQueryOptions } from "@/repositories/firefly-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LucideIcon, Trash2Icon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useToast } from "@/hooks/use-toast";
import { useRouteContext } from "@tanstack/react-router";
import { cn, type GenericObject } from "@/lib/utils";
import type { SetCategoryIcon } from "@/repositories/categories-fns";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const iconNames = Object.keys(dynamicIconImports);

const CategoryDetailsForm: React.FC<SetCategoryIcon> = (props) => {
  const { queryClient } = useRouteContext({ from: "__root__" });
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: setCategoryIcon,
    onMutate: async ({ data }) => {
      const expectedCategorySetting = {
        id: data.category_id,
        lucide_icon: data.lucide_icon,
      };

      await queryClient.cancelQueries({
        queryKey: settingsQueryKey.category(),
      });

      const previousSettings = queryClient.getQueryData<
        Array<{
          id: string;
          lucide_icon: string;
        }>
      >(settingsQueryKey.category());

      queryClient.setQueryData<
        Array<{
          id: string;
          lucide_icon: string;
        }>
      >(settingsQueryKey.category(), (old) => {
        if (!old) return [expectedCategorySetting];

        const categorySettingIndex = old.findIndex(
          (setting) => setting.id === expectedCategorySetting.id
        );

        if (!categorySettingIndex) return [...old, expectedCategorySetting];

        old[categorySettingIndex] = {
          ...old[categorySettingIndex],
          lucide_icon: expectedCategorySetting.lucide_icon,
        };

        return old;
      });

      return { previousSettings };
    },
    onSuccess: (_d, { data }) => {
      form.reset(data, { keepDirty: false });
      toast({
        title: "Categoría actualizada",
        variant: "default",
        description:
          "El icono de la categoría ha sido actualizado correctamente",
      });
    },
    onError: (error, _newTodo, context) => {
      queryClient.setQueryData(settingsQueryKey.category(), context);
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: settingsQueryKey.category() });
    },
  });

  const form = useForm<SetCategoryIcon>({
    defaultValues: props,
  });
  const { formState } = form;

  const onSubmit: SubmitHandler<SetCategoryIcon> = (data) => {
    mutate({ data });
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="flex justify-between items-center gap-2">
          <h4 className="text-sm font-bold">Jerarquia</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
          id="category_accounts_form"
        >
          <DynamicIcon
            name={
              !iconNames.includes(form.watch("lucide_icon"))
                ? "folder-open-dot"
                : (form.watch("lucide_icon") as keyof typeof dynamicIconImports)
            }
            className="w-10 h-10 text-primary"
          />
          <Label htmlFor="lucide_icon">Icono</Label>
          <Input
            {...form.register("lucide_icon", {
              validate: (value) => {
                if (!iconNames.includes(value)) {
                  return "Icono no encontrado";
                }
              },
            })}
            placeholder="folder-open-dot"
            type="text"
            className={cn(formState.errors.lucide_icon && "border-red-500")}
          />
          {formState.errors.lucide_icon && (
            <p className="text-sm text-red-500">
              {formState.errors.lucide_icon.message}
            </p>
          )}
          <p className="text-sm">
            Encuentra un nombre de icono en{" "}
            <a
              href="https://lucide.dev/icons/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              lucide.dev/icons/
            </a>
          </p>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        {formState.isDirty ? (
          <>
            <Button
              type="button"
              onClick={() => form.reset(props)}
              variant="outline"
            >
              Cancelar / Restablecer
            </Button>
            <Button
              disabled={!formState.isValid || isPending}
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

export default CategoryDetailsForm;
