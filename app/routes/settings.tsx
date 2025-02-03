import { createFileRoute } from "@tanstack/react-router";
import {
  accountsQueryOptions,
  categoriesQueryOptions,
} from "@/repositories/firefly-fns";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categorySettingsQueryOptions } from "@/repositories/categories-fns";
import CategoryAccountsForm from "@/components/CategoryAccountsForm";
import CategoryDetailsForm from "@/components/CategoryDetailsForm";
import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const categoriesQuery = context.queryClient.ensureQueryData(
      categoriesQueryOptions()
    );
    const expenseAccountsQuery = context.queryClient.ensureQueryData(
      accountsQueryOptions({ type: "expense" })
    );
    const categorySettingsQuery = context.queryClient.ensureQueryData(
      categorySettingsQueryOptions()
    );

    await Promise.all([
      categoriesQuery,
      expenseAccountsQuery,
      categorySettingsQuery,
    ]);
  },
});

function RouteComponent() {
  const iconNames = Object.keys(dynamicIconImports);

  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());

  const { data: categorySettings } = useSuspenseQuery(
    categorySettingsQueryOptions()
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Configuración</h2>
      <div className="space-y-2">
        <h3 className="text-md font-bold">Categorias</h3>
        <Accordion type="single" collapsible>
          {categories.map((category) => {
            const settings = categorySettings.find(
              (setting) => setting.id === category.id
            );

            const iconName = !iconNames.includes(settings?.lucide_icon ?? "")
              ? "folder-open-dot"
              : (settings?.lucide_icon as keyof typeof dynamicIconImports);

            return (
              <AccordionItem value={category.id} key={category.id}>
                <AccordionTrigger>
                  <div className="flex gap-2 items-center">
                    <DynamicIcon name={iconName} className="text-primary" />
                    {category.attributes.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <CategoryDetailsForm
                    category_id={category.id}
                    lucide_icon={settings?.lucide_icon ?? ""}
                  />
                  <CategoryAccountsForm
                    category_id={category.id}
                    expense_accounts={settings?.expense_accounts ?? []}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
