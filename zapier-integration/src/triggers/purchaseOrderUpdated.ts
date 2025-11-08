import { ZapierBundle, PurchaseOrder } from '../types';
import { makeAuthenticatedRequest } from '../utils/http';

const subscribeHook = async (z: any, bundle: ZapierBundle) => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'POST',
    url: '/api/webhooks/subscribe',
    body: { targetUrl: bundle.targetUrl, event: 'purchaseOrder.updated' },
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

const performList = async (z: any, bundle: ZapierBundle): Promise<PurchaseOrder[]> => {
  const response = await makeAuthenticatedRequest(z, bundle, {
    method: 'GET',
    url: '/api/trpc/purchaseOrders.list',
    params: { limit: bundle.meta.limit || 100, sort: 'updatedAt:desc' },
  });
  return response.result?.data || [];
};

const perform = async (z: any, bundle: ZapierBundle): Promise<PurchaseOrder[]> => {
  return bundle.cleanedRequest ? [bundle.cleanedRequest as PurchaseOrder] : performList(z, bundle);
};

export default {
  key: 'purchaseOrderUpdated',
  noun: 'PurchaseOrder',
  display: { label: 'Updated Purchase Order', description: 'Triggers when a purchase order is updated.' },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform,
    performList,
    inputFields: [],
    outputFields: [
      { key: 'id', label: 'ID', type: 'integer' },
      { key: 'createdAt', label: 'Created At', type: 'datetime' },
      { key: 'updatedAt', label: 'Updated At', type: 'datetime' },
    ],
    sample: { id: 1, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
  },
};
