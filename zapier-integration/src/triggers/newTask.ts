import { ZapierBundle, Task } from '../types';
import { makeAuthenticatedRequest, dedupeKey } from '../utils/http';

const subscribeHook = async (z: any, bundle: ZapierBundle) => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/webhooks/subscribe',
    body: {
      targetUrl: bundle.targetUrl,
      event: 'task.created',
    },
  });

  return response.data;
};

const unsubscribeHook = async (z: any, bundle: ZapierBundle) => {
  await makeAuthenticatedRequest(z, bundle, {
    method: 'DELETE',
    url: `/api/webhooks/${bundle.subscribeData?.id}`,
  });

  return {};
};

const performList = async (z: any, bundle: ZapierBundle): Promise<Task[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/tasks.list',
    params: {
      limit: bundle.meta.limit || 100,
      page: bundle.meta.page || 0,
      sort: 'createdAt:desc',
    },
  });

  return response.result?.data || [];
};

const perform = async (z: any, bundle: ZapierBundle): Promise<Task[]> => {
  if (bundle.cleanedRequest) {
    // Webhook data
    return [bundle.cleanedRequest as Task];
  }

  // Polling fallback
  return performList(z, bundle);
};

export default {
  key: 'newTask',
  noun: 'Task',
  display: {
    label: 'New Task',
    description: 'Triggers when a new task is created.',
    important: true,
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform,
    performList,
    inputFields: [],
    outputFields: [
      { key: 'id', label: 'ID', type: 'integer' },
      { key: 'title', label: 'Title', type: 'string' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'priority', label: 'Priority', type: 'string' },
      { key: 'dueDate', label: 'Due Date', type: 'datetime' },
      { key: 'userId', label: 'User ID', type: 'integer' },
      { key: 'createdAt', label: 'Created At', type: 'datetime' },
      { key: 'updatedAt', label: 'Updated At', type: 'datetime' },
    ],
    sample: {
      id: 1,
      title: 'Complete Q4 Report',
      description: 'Finish the quarterly financial report',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-12-31T23:59:59Z',
      userId: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
