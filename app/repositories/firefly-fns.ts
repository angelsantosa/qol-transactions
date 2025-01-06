import { createServerFn } from '@tanstack/start';
import { queryOptions } from '@tanstack/react-query';
import { fetchFireflyCategories } from './firefly-services';
import { categorySchema } from '@/entities';

export const fetchCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    const fireflyCategories = await fetchFireflyCategories();
    return categorySchema.array().parse(
      fireflyCategories.data.map(
        (ffc: {
          id: string;
          attributes: { name: string };
          links: { self: string };
        }) => ({
          id: ffc?.id,
          name: ffc?.attributes.name,
          okaneLink: ffc?.links.self,
        }),
      ),
    );
  },
);

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });
