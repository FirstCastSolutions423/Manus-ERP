import { ZapierBundle, Contact } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Contact> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'PUT',
    url: '/api/trpc/contacts.update',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'updateContact',
  noun: 'Contact',
  display: {
    label: 'Update Contact',
    description: 'Updates an existing contact.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: true },
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
