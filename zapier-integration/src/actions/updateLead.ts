import { ZapierBundle, Lead } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Lead> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'PUT',
    url: '/api/trpc/leads.update',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'updateLead',
  noun: 'Lead',
  display: {
    label: 'Update Lead',
    description: 'Updates an existing lead.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: true },
      { key: 'status', label: 'Status', required: false },
      { key: 'score', label: 'Score', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
