import { ZapierBundle, Lead } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Lead[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/leads.search',
    params: bundle.inputData,
  });

  return response.result?.data || [];
};

export default {
  key: 'findLead',
  noun: 'Lead',
  display: {
    label: 'Find Lead',
    description: 'Finds a lead by email or external key.',
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
