import { ZapierBundle, Employee } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Employee> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'PUT',
    url: '/api/trpc/employees.update',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'updateEmployee',
  noun: 'Employee',
  display: {
    label: 'Update Employee',
    description: 'Updates an existing employee.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: true },
      { key: 'status', label: 'Status', required: false },
      { key: 'position', label: 'Position', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
