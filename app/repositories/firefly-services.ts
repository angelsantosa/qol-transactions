import * as v from 'valibot';
import axios from 'axios';
import {
  FireflyAccountListSchema,
  FireflyCategorySchema,
  type FireflyAccountType,
} from '@/entities';
import { checkVailbotFieldErrors } from '@/lib/utils';

const fireFlyApi = process.env.FIREFLY_API_URL;
const fireFlyApiKey = process.env.FIREFLY_PT;

const headers = {
  accept: 'application/json',
  'content-type': 'application/json',
  authorization: `Bearer ${fireFlyApiKey}`,
};

export const fetchFireflyCategories = async () => {
  const request = await axios.get(`${fireFlyApi}/categories`, {
    headers,
  });
  try {
    return v.parse(FireflyCategorySchema, request.data);
  } catch (error) {
    if (v.isValiError(error)) throw checkVailbotFieldErrors(error);
    throw error;
  }
};

export const fetchFireFlyAccounts = async (params: {
  type: FireflyAccountType;
}) => {
  const request = await axios.get(`${fireFlyApi}/accounts`, {
    params,
    headers,
  });
  try {
    return v.parse(FireflyAccountListSchema, request.data);
  } catch (error) {
    if (v.isValiError(error)) throw checkVailbotFieldErrors(error);
    throw error;
  }
};
