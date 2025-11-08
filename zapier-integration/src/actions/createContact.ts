import { ZapierBundle, Contact } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Contact> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/trpc/contacts.create',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'createContact',
  noun: 'Contact',
  display: {
    label: 'Create Contact',
    description: 'Creates a new contact.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', required: false },
      { key: 'company', label: 'Company', required: false },
      { key: 'phone', label: 'Phone', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
