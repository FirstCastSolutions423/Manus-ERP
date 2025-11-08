import { ZapierBundle, Contact } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Contact[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/contacts.search',
    params: bundle.inputData,
  });

  return response.result?.data || [];
};

export default {
  key: 'findContact',
  noun: 'Contact',
  display: {
    label: 'Find Contact',
    description: 'Finds a contact by email.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: false },
      { key: 'email', label: 'Email', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
    },
  },
};
