import { ZapierBundle, Employee } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<Employee[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/employees.search',
    params: bundle.inputData,
  });

  return response.result?.data || [];
};

export default {
  key: 'findEmployee',
  noun: 'Employee',
  display: {
    label: 'Find Employee',
    description: 'Finds an employee by email or employee ID.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: false },
      { key: 'email', label: 'Email', required: false },
      { key: 'employeeId', label: 'Employeeid', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
    },
  },
};
