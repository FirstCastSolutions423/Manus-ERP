import { ZapierBundle, Ticket } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Ticket[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/tickets.search',
    params: bundle.inputData,
  });

  return response.result?.data || [];
};

export default {
  key: 'findTicket',
  noun: 'Ticket',
  display: {
    label: 'Find Ticket',
    description: 'Finds a ticket by ID or number.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: false },
      { key: 'title', label: 'Title', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
    },
  },
};
