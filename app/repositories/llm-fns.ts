import * as v from 'valibot';
import { createServerFn } from '@tanstack/start';
import { DescriptionPromptParams } from '@/lib/prompts';
import { suggestTransactionDescription } from './llm-services';

export const generateDescription = createServerFn({
  method: 'POST',
})
  .validator((data: DescriptionPromptParams) =>
    v.parse(DescriptionPromptParams, data),
  )
  .handler(async ({ data }) => {
    const msg = await suggestTransactionDescription(data);
    return msg.type === 'text' ? msg.text : data.description;
  });
