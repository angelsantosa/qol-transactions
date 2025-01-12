import { expect, describe, it } from 'vitest';
import { createFireflyListSchema } from '../utils';
import * as v from 'valibot';

describe('createApiSchema', () => {
  // Setup a sample schema for testing
  const UserAttributesSchema = v.object({
    email: v.string(),
    age: v.number(),
    username: v.string(),
  });

  const UserApiSchema = createFireflyListSchema(UserAttributesSchema);

  it('should validate a correct payload', () => {
    const validPayload = {
      meta: {
        pagination: {
          total: 100,
          count: 10,
          per_page: 10,
          current_page: 1,
          total_pages: 10,
        },
      },
      data: [
        {
          type: 'accounts',
          id: '1',
          attributes: {
            name: 'John Doe',
            created_at: '2024-03-20T00:00:00Z',
            updated_at: '2024-03-20T00:00:00Z',
            email: 'john@example.com',
            age: 30,
            username: 'johndoe',
          },
        },
      ],
    };

    expect(() => v.parse(UserApiSchema, validPayload)).not.toThrow();
  });

  it('should validate an empty data array', () => {
    const emptyDataPayload = {
      meta: {
        pagination: {
          total: 0,
          count: 0,
          per_page: 10,
          current_page: 1,
          total_pages: 0,
        },
      },
      data: [],
    };

    expect(() => v.parse(UserApiSchema, emptyDataPayload)).not.toThrow();
  });

  it('should fail with missing required fields', () => {
    const missingFieldsPayload = {
      meta: {
        pagination: {
          total: 1,
          count: 1,
          per_page: 10,
          current_page: 1,
          total_pages: 1,
        },
      },
      data: [
        {
          type: 'accounts',
          id: '1',
          attributes: {
            name: 'John Doe',
            created_at: '2024-03-20T00:00:00Z',
            updated_at: '2024-03-20T00:00:00Z',
            // Missing email and age
            username: 'johndoe',
          },
        },
      ],
    };

    expect(() => v.parse(UserApiSchema, missingFieldsPayload)).toThrow();
  });
});
