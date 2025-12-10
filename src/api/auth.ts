import { callApi } from './client';

export interface AuthWithGoogleRequest {
  id_token: string;
}

export async function authWithGoogle<TResponse = unknown>(idToken: string) {
  return callApi<TResponse>({
    method: 'POST',
    url: '/auth/google',
    data: { id_token: idToken } satisfies AuthWithGoogleRequest,
  });
}

