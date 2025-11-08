import { ZapierBundle, Lead } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Lead> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/trpc/leads.create',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'createLead',
  noun: 'Lead',
  display: {
    label: 'Create Lead',
    description: 'Creates a new sales lead.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', required: false },
      { key: 'company', label: 'Company', required: false },
      { key: 'phone', label: 'Phone', required: false },
      { key: 'source', label: 'Source', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
