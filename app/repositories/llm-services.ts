import {
  type DescriptionPromptParams,
  transactionDescriptionEsPrompt,
} from '@/lib/prompts';
import Anthropic from '@anthropic-ai/sdk';

export const suggestTransactionDescription = async (
  params: DescriptionPromptParams,
) => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  const msg = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 30,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: transactionDescriptionEsPrompt(params),
          },
        ],
      },
    ],
  });
  return msg.content[0];
};
