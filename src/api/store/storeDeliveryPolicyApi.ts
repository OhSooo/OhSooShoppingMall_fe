import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface StoreDeliveryPolicyResponse {
  deliveryPolicyId: number;
  storeId: number;
  baseDeliveryFee: number;
  freeDeliveryThreshold: number | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

/**
 * PUT 요청: 백엔드는 freeDeliveryThreshold 누락 시 기존 값을 null로 덮어씀.
 * 실수로 누락하는 것을 막기 위해 필수 필드로 두고, 무료배송 기준 제거는 명시적으로 null 전달.
 */
export interface StoreDeliveryPolicyUpsertRequest {
  baseDeliveryFee: number;
  freeDeliveryThreshold: number | null;
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
  if (request.freeDeliveryThreshold === undefined) {
    throw new Error('freeDeliveryThreshold가 누락되었습니다. 무료배송 기준을 제거하려면 null을 명시하세요.');
  }
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/delivery-policy`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<StoreDeliveryPolicyResponse>(response);
  return data.data!;
}
