import { ZapierBundle, Transaction } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const subscribeHook = async (z: any, bundle: ZapierBundle) => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/webhooks/subscribe',
    body: { targetUrl: bundle.targetUrl, event: 'transaction.created' },
  });
  return response.data;
};

const unsubscribeHook = async (z: any, bundle: ZapierBundle) => {
  await makeAuthenticatedRequest(z, bundle, {
    method: 'DELETE',
    url: `/api/webhooks/${bundle.subscribeData?.id}`,
  });
  return {};
};

const performList = async (z: any, bundle: ZapierBundle): Promise<Transaction[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/transactions.list',
    params: { limit: bundle.meta.limit || 100, sort: 'createdAt:desc' },
  });
  return response.result?.data || [];
};

const perform = async (z: any, bundle: ZapierBundle): Promise<Transaction[]> => {
  return bundle.cleanedRequest ? [bundle.cleanedRequest as Transaction] : performList(z, bundle);
};

export default {
  key: 'newTransaction',
  noun: 'Transaction',
  display: { label: 'New Transaction', description: 'Triggers when a new transaction is recorded.', important: true },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform,
    performList,
    inputFields: [],
    outputFields: [
      { key: 'id', label: 'ID', type: 'integer' },
      { key: 'type', label: 'Type', type: 'string' },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'description', label: 'Description', type: 'string' },
      { key: 'date', label: 'Date', type: 'datetime' },
      { key: 'createdAt', label: 'Created At', type: 'datetime' },
    ],
    sample: { id: 1, type: 'income', amount: 150000, description: 'Client payment', date: '2024-01-15', createdAt: '2024-01-15T10:30:00Z' },
  },
};
