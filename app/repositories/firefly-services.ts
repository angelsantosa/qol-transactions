import axios from 'axios';
import type { AccountType } from '@/entities';

const fireFlyApi = 'https://okane.kukan.cloud/api/v1';
const fireFlyApiKey = process.env.OKANE_PT;

const headers = {
  accept: 'application/json',
  'content-type': 'application/json',
  authorization: `Bearer ${fireFlyApiKey}`,
};

export const fetchFireflyCategories = async () => {
  const request = await axios.get(`${fireFlyApi}/categories`, {
    headers,
  });
  return request.data;
};

export const fetchFireFlyAccounts = async (params: { type: AccountType }) => {
  const request = await axios.get(`${fireFlyApi}/accounts`, {
    params,
    headers,
  });
  return request.data;
};
