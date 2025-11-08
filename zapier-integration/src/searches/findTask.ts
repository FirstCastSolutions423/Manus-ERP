import { ZapierBundle, Task } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Task[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/tasks.search',
    params: bundle.inputData,
  });

  return response.result?.data || [];
};

export default {
  key: 'findTask',
  noun: 'Task',
  display: {
    label: 'Find Task',
    description: 'Finds a task by ID or external key.',
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
