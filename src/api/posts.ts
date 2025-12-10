import { callApi } from './client';

export interface PostPayload {
  seller_id: string;
  category_id: number | string;
  title: string;
  description: string;
  price: number;
  item_condition: string;
  listing_type: 'rent' | 'sell';
  status: string;
  meetup_preference?: string;
  rental_details?: {
    rent_unit?: string;
    deposit_amount?: number;
    min_rent_period?: number;
    max_rent_period?: number;
  };
}

function buildPostFormData(payload: PostPayload, images: (Blob | File)[] = []) {
  const formData = new FormData();
  formData.append('payload', JSON.stringify(payload));
  images.forEach(image => formData.append('images', image));
  return formData;
}

export async function createPost<TResponse = unknown>(
  payload: PostPayload,
  images: (Blob | File)[] = []
) {
  const formData = buildPostFormData(payload, images);
  return callApi<TResponse>({
    method: 'POST',
    url: '/posts',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function updatePost<TResponse = unknown>(
  id: string,
  payload: PostPayload,
  images: (Blob | File)[] = []
) {
  const formData = buildPostFormData(payload, images);
  return callApi<TResponse>({
    method: 'PUT',
    url: `/posts/${id}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

