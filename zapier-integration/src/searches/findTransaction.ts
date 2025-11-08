import { ZapierBundle, Transaction } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Transaction[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/transactions.search',
    params: bundle.inputData,
  });

  return response.result?.data || [];
};

export default {
  key: 'findTransaction',
  noun: 'Transaction',
  display: {
    label: 'Find Transaction',
    description: 'Finds a transaction by ID.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
    },
  },
};
