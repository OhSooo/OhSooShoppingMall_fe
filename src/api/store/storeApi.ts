import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface StoreResponse {
  storeId: number;
  ownerId: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreRequest {
  name: string;
  description?: string;
}

export interface StoreProfileUpdateRequest {
  description?: string;
  notice?: string;
  mainImageUrl?: string;
}

export interface StoreOperationStatusUpdateRequest {
  operationStatus: 'OPEN' | 'CLOSED' | 'PAUSED';
}

export interface StoreProfileResponse {
  storeId: number;
  ownerId: number;
  name: string;
  description: string;
  notice: string;
  mainImageUrl: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  operationStatus: 'OPEN' | 'CLOSED' | 'PAUSED';
  createdAt: string;
  updatedAt: string;
}

export async function getStores(): Promise<StoreResponse[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores`);
  const data = await handleApiResponse<StoreResponse[]>(response);
  return data.data ?? [];
}

export async function createStore(request: CreateStoreRequest): Promise<StoreResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<StoreResponse>(response);
  return data.data!;
}

export async function updateStoreProfile(
  storeId: number,
  request: StoreProfileUpdateRequest,
): Promise<StoreProfileResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/profile`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<StoreProfileResponse>(response);
  return data.data!;
}

export async function changeOperationStatus(
  storeId: number,
  request: StoreOperationStatusUpdateRequest,
): Promise<StoreProfileResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/operation-status`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<StoreProfileResponse>(response);
  return data.data!;
}
