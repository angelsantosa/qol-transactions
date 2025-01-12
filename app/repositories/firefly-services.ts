import * as v from 'valibot';
import axios from 'axios';
import {
  FireflyAccountListSchema,
  FireflyCategorySchema,
  type FireflyAccountType,
} from '@/entities';
import { checkVailbotFieldErrors } from '@/lib/utils';

const fireFlyApiUrl = process.env.FIREFLY_API_URL;
const fireFlyPersonalToken = process.env.FIREFLY_PERSONAL_TOKEN;

const headers = {
  accept: 'application/json',
  'content-type': 'application/json',
  authorization: `Bearer ${fireFlyPersonalToken}`,
};

export const fetchFireflyCategories = async () => {
  const request = await axios.get(`${fireFlyApiUrl}/categories`, {
    headers,
  });
  try {
    return v.parse(FireflyCategorySchema, request.data);
  } catch (error) {
    if (v.isValiError(error)) throw checkVailbotFieldErrors(error);
    throw error;
  }
};

export const fetchFireFlyAccounts = async ({
  type,
}: {
  type: FireflyAccountType;
}) => {
  const request = await axios.get(`${fireFlyApiUrl}/accounts`, {
    params: {
      type,
    },
    headers,
  });
  try {
    return v.parse(FireflyAccountListSchema, request.data);
  } catch (error) {
    if (v.isValiError(error)) throw checkVailbotFieldErrors(error);
    throw error;
  }
};
