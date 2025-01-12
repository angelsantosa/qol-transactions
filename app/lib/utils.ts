import * as v from 'valibot';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GenericObjectSchema = v.object({
  id: v.string(),
});

export type GenericObject = v.InferOutput<typeof GenericObjectSchema>;

export const FireflyTypeSchema = v.union([
  v.literal('accounts'),
  v.literal('transactions'),
  v.literal('categories'),
]);

export const FireflyMetaSchema = v.object({
  meta: v.object({
    pagination: v.object({
      total: v.number(),
      count: v.number(),
      per_page: v.number(),
      current_page: v.number(),
      total_pages: v.number(),
    }),
  }),
});

export const FireflyDataSchema = v.object({
  type: FireflyTypeSchema,
  id: v.string(),
});

export const FireflyAttributesSchema = v.object({
  name: v.string(),
  created_at: v.string(),
  updated_at: v.string(),
});

export const createFireflyListSchema = <
  TEntrie extends v.ObjectEntries,
  TMessage extends v.ErrorMessage<v.ObjectIssue> | undefined,
>(
  attributesObject: v.ObjectSchema<TEntrie, TMessage>,
) =>
  v.object({
    ...FireflyMetaSchema.entries,
    data: v.array(
      v.object({
        ...FireflyDataSchema.entries,
        attributes: v.object({
          ...FireflyAttributesSchema.entries,
          ...attributesObject.entries,
        }),
      }),
    ),
  });

export const createFireflyItemSchema = <
  TEntrie extends v.ObjectEntries,
  TMessage extends v.ErrorMessage<v.ObjectIssue> | undefined,
>(
  attributesObject: v.ObjectSchema<TEntrie, TMessage>,
) => {
  return v.object({
    data: v.object({
      ...FireflyDataSchema.entries,
      attributes: v.object({
        ...FireflyAttributesSchema.entries,
        ...attributesObject.entries,
      }),
    }),
  });
};

export const checkVailbotFieldErrors = (
  error: v.ValiError<
    | v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
    | v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>
  >,
): Error => {
  const formErrors: Record<string, string> = {};
  const flatIssues = v.flatten(error.issues);
  // Track array validation patterns to avoid duplicates
  const arrayErrors = new Map<string, string>();

  for (const [path, errors] of Object.entries(flatIssues.nested ?? {})) {
    const errorMessage = Array.isArray(errors) ? errors[0] : String(errors);

    // Check if this is an array-related error (contains a numeric segment)
    const segments = path.split('.');
    const arrayPathMatch = segments.findIndex(
      (segment) => !Number.isNaN(Number(segment)),
    );

    if (arrayPathMatch !== -1) {
      // Reconstruct the path pattern without the numeric index
      const pathPattern = [
        ...segments.slice(0, arrayPathMatch),
        '[]',
        ...segments.slice(arrayPathMatch + 1),
      ].join('.');

      // Only store the first occurrence of this array error pattern
      if (!arrayErrors.has(pathPattern)) {
        arrayErrors.set(pathPattern, errorMessage);
      }
    } else {
      // Handle non-array errors normally
      formErrors[path] = errorMessage;
    }
  }
  // Add consolidated array errors to formErrors
  for (const [pathPattern, error] of arrayErrors) {
    formErrors[pathPattern] = error;
  }

  const errorMessage = `\n${Object.entries(formErrors)
    .map(([key, value]) => `- ${key}: ${value.split(':')[1].trim()}`)
    .join('\n')}
  `;
  const returnError = new Error(errorMessage);
  returnError.name = 'Schema Validation Error';
  return returnError;
};
