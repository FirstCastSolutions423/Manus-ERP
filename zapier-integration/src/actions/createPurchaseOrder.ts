import { ZapierBundle, PurchaseOrder } from '../types';
import { makeAuthenticatedRequest, generateIdempotencyKey } from '../utils/http';

const perform = async (z: any, bundle: ZapierBundle): Promise<PurchaseOrder> => {
  const idempotencyKey = generateIdempotencyKey();
  
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/trpc/purchaseOrders.create',
    body: bundle.inputData,
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  return response.result?.data;
};

export default {
  key: 'createPurchaseOrder',
  noun: 'PurchaseOrder',
  display: {
    label: 'Create Purchase Order',
    description: 'Creates a new purchase order.',
  },
  operation: {
    perform,
    inputFields: [
      { key: 'poNumber', label: 'Ponumber', required: false },
      { key: 'vendorName', label: 'Vendorname', required: false },
      { key: 'totalAmount', label: 'Totalamount', required: false },
      { key: 'orderDate', label: 'Orderdate', required: false },
    ],
    sample: {
      id: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  },
};
