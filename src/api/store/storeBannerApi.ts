import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface StoreBannerResponse {
  storeBannerId: number;
  storeId: number;
  imageUrl: string;
  linkUrl: string | null;
  title: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreBannerCreateRequest {
  imageUrl: string;
  linkUrl?: string;
  title?: string;
}

export interface StoreBannerUpdateRequest {
  imageUrl?: string;
  linkUrl?: string;
  title?: string;
}

export interface StoreBannerOrderUpdateRequest {
  bannerIds: number[];
}

export async function getBanners(storeId: number): Promise<StoreBannerResponse[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/banners`);
  const data = await handleApiResponse<StoreBannerResponse[]>(response);
  return data.data ?? [];
}

export async function createBanner(
  storeId: number,
  request: StoreBannerCreateRequest,
): Promise<StoreBannerResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/banners`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<StoreBannerResponse>(response);
  return data.data!;
}

export async function updateBanner(
  storeId: number,
  bannerId: number,
  request: StoreBannerUpdateRequest,
): Promise<StoreBannerResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/banners/${bannerId}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<StoreBannerResponse>(response);
  return data.data!;
}

export async function deleteBanner(storeId: number, bannerId: number): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/banners/${bannerId}`, {
    method: 'DELETE',
  });
  await handleApiResponse<null>(response);
}

export async function reorderBanners(
  storeId: number,
  request: StoreBannerOrderUpdateRequest,
): Promise<StoreBannerResponse[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/stores/${storeId}/banners/order`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<StoreBannerResponse[]>(response);
  return data.data ?? [];
}
