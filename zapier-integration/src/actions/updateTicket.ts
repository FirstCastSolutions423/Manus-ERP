import { ZapierBundle, Ticket } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Ticket> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'PUT',
    url: '/api/trpc/tickets.update',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'updateTicket',
  noun: 'Ticket',
  display: {
    label: 'Update Ticket',
    description: 'Updates an existing ticket.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: true },
      { key: 'status', label: 'Status', required: false },
      { key: 'priority', label: 'Priority', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
