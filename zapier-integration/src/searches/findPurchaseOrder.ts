import { ZapierBundle, PurchaseOrder } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<PurchaseOrder[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/purchaseOrders.search',
    params: bundle.inputData,
  });

  return response.result?.data || [];
};

export default {
  key: 'findPurchaseOrder',
  noun: 'PurchaseOrder',
  display: {
    label: 'Find Purchase Order',
    description: 'Finds a purchase order by PO number.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'id', label: 'Id', required: false },
      { key: 'poNumber', label: 'Ponumber', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
    },
  },
};
