import { ZapierBundle, Transaction } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Transaction> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/trpc/transactions.create',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'createTransaction',
  noun: 'Transaction',
  display: {
    label: 'Create Transaction',
    description: 'Creates a new financial transaction.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'type', label: 'Type', required: true },
      { key: 'amount', label: 'Amount', required: true },
      { key: 'description', label: 'Description', required: false },
      { key: 'date', label: 'Date', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
