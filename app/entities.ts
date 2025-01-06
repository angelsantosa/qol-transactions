import z from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  okaneLink: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
