import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface StoreDeliveryPolicyResponse {
  deliveryPolicyId: number;
  storeId: number;
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface StoreDeliveryPolicyUpsertRequest {
  baseDeliveryFee: number;
  freeDeliveryThreshold?: number;
}

export async function getDeliveryPolicy(storeId: number): Promise<StoreDeliveryPolicyResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/delivery-policy`);
  const data = await handleApiResponse<StoreDeliveryPolicyResponse>(response);
  return data.data!;
}

export async function upsertDeliveryPolicy(
  storeId: number,
  request: StoreDeliveryPolicyUpsertRequest,
): Promise<StoreDeliveryPolicyResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/delivery-policy`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<StoreDeliveryPolicyResponse>(response);
  return data.data!;
}
