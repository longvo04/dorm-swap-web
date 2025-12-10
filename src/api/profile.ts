import { callApi } from './client';

export interface UpdateProfilePayload {
  user_id: string;
  full_name: string;
  dorm_building: string;
  dorm_room: string;
}

export async function getUserProfile<TResponse = unknown>(userId: string) {
  return callApi<TResponse>({
    method: 'GET',
    url: '/profile',
    params: { user_id: userId },
  });
}

export async function getUserListings<TResponse = unknown>(userId: string) {
  return callApi<TResponse>({
    method: 'GET',
    url: '/profile/listings',
    params: { user_id: userId },
  });
}

export async function getUserItem<TResponse = unknown>(userId: string, itemId: string) {
  return callApi<TResponse>({
    method: 'GET',
    url: `/profile/items/${itemId}`,
    params: { user_id: userId },
  });
}

export async function deleteUserItem<TResponse = unknown>(userId: string, itemId: string) {
  return callApi<TResponse>({
    method: 'DELETE',
    url: `/profile/items/${itemId}`,
    params: { user_id: userId },
  });
}

export async function updateUserProfile<TResponse = unknown>(data: UpdateProfilePayload) {
  return callApi<TResponse>({
    method: 'PUT',
    url: '/profile',
    data,
  });
}

