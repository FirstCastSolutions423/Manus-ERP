import { ZapierBundle, Task } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Task> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/trpc/tasks.create',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'createTask',
  noun: 'Task',
  display: {
    label: 'Create Task',
    description: 'Creates a new task in the ERP system.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', required: false },
      { key: 'status', label: 'Status', required: false },
      { key: 'priority', label: 'Priority', required: false },
      { key: 'dueDate', label: 'Duedate', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
