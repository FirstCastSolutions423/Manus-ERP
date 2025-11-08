import { ZapierBundle } from '../types';

const BASE_URL = process.env.BASE_URL || 'https://your-erp.manus.space';

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

export const makeRequest = async (
  z: any,
  options: RequestOptions
): Promise<any> => {
  const { method, url, params, body, headers } = options;

  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const response = await z.request({
    method,
    url: fullUrl,
    params,
    body,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  return response.json;
};

export const makeAuthenticatedRequest = async (
  z: any,
  bundle: ZapierBundle,
  options: Omit<RequestOptions, 'headers'> & { headers?: Record<string, string> }
): Promise<any> => {
  return makeRequest(z, {
    ...options,
    headers: {
      Authorization: `Bearer ${bundle.authData.access_token}`,
      ...(options.headers || {}),
    },
  });
};

export const handleErrors = (response: any, z: any) => {
  if (response.status >= 400) {
    const error = response.json?.error || {};
    throw new z.errors.Error(
      error.message || `HTTP ${response.status}: ${response.statusText}`,
      error.code || 'ApiError',
      response.status
    );
  }
  return response;
};

export const generateIdempotencyKey = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
};

export const dedupeKey = (obj: any): string => {
  return `${obj.id}-${obj.updatedAt || obj.createdAt}`;
};
