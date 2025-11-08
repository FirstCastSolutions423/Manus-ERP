import { ZapierBundle, Employee } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Employee> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/trpc/employees.create',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'createEmployee',
  noun: 'Employee',
  display: {
    label: 'Create Employee',
    description: 'Creates a new employee record.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'employeeId', label: 'Employeeid', required: false },
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', required: false },
      { key: 'department', label: 'Department', required: false },
      { key: 'position', label: 'Position', required: false },
      { key: 'hireDate', label: 'Hiredate', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
