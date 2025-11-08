import { ZapierBundle, Task } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Task> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'PUT',
    url: '/api/trpc/tasks.update',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'updateTask',
  noun: 'Task',
  display: {
    label: 'Update Task',
    description: 'Updates an existing task.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: true },
      { key: 'title', label: 'Title', required: true },
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
