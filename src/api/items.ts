import { callApi } from './client';

export interface GetItemsParams {
  listing_type?: 'rent' | 'sell';
  item_condition?: string;
  min_price?: number;
  max_price?: number;
  category_id?: string | number;
  page?: number;
  limit?: number;
}

export async function getItems<TResponse = unknown>(params?: GetItemsParams) {
  return callApi<TResponse>({
    method: 'GET',
    url: '/items',
    params,
  });
}

export async function getItemDetails<TResponse = unknown>(id: string) {
  return callApi<TResponse>({
    method: 'GET',
    url: `/items/${id}`,
  });
}

