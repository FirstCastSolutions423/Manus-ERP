import { ZapierBundle, Transaction } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const subscribeHook = async (z: any, bundle: ZapierBundle) => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/webhooks/subscribe',
    body: { targetUrl: bundle.targetUrl, event: 'transaction.updated' },
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
    params: { limit: bundle.meta.limit || 100, sort: 'updatedAt:desc' },
  });
  return response.result?.data || [];
};

const perform = async (z: any, bundle: ZapierBundle): Promise<Transaction[]> => {
  return bundle.cleanedRequest ? [bundle.cleanedRequest as Transaction] : performList(z, bundle);
};

export default {
  key: 'transactionUpdated',
  noun: 'Transaction',
  display: { label: 'Updated Transaction', description: 'Triggers when a transaction is updated.' },
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
      { key: 'flagged', label: 'Flagged', type: 'boolean' },
      { key: 'updatedAt', label: 'Updated At', type: 'datetime' },
    ],
    sample: { id: 1, type: 'expense', amount: 50000, flagged: true, updatedAt: '2024-01-15T10:30:00Z' },
  },
};
