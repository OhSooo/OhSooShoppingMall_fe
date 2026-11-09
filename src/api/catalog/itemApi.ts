import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface OptionDto {
  type: 'SIZE' | 'COLOR';
  value: string;
}

export interface VariantDto {
  sku: string;
  price: number;
  initialQuantity: number;
  options?: OptionDto[];
}

export interface VariantResult {
  itemVariantId: number;
  sku: string;
  price: number;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'DISABLED';
  initialQuantity: number;
}

export interface ItemCreateRequest {
  storeId: number;
  categoryId: number;
  name: string;
  basePrice: number;
  variants: VariantDto[];
}

export interface ItemCreateResponse {
  itemId: number;
  storeId: number;
  categoryId: number;
  name: string;
  basePrice: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  variants: VariantResult[];
}

export interface AddVariantsRequest {
  variants: VariantDto[];
}

export interface AddVariantsResponse {
  itemId: number;
  variants: VariantResult[];
}

export interface ItemImageCreateRequest {
  imageUrl: string;
  isPrimary?: boolean;
  altText?: string;
}

export interface ItemImageResponse {
  imageId: number;
  itemId: number;
  imageUrl: string;
  displayOrder: number;
  altText: string;
  createdAt: string;
  updatedAt: string;
  isPrimary: boolean;
}

export interface ItemDetailResponse {
  id: number;
  storeId: number;
  categoryId: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  basePrice: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: ItemImageResponse[];
  deleted: boolean;
}

export interface ItemUpdateRequest {
  name?: string;
  categoryId?: number;
  basePrice?: number;
}

export interface ItemStatusUpdateRequest {
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ItemResponse {
  id: number;
  storeId: number;
  categoryId: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  basePrice: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted: boolean;
}

export interface ItemImageUpdateRequest {
  imageUrl?: string;
  isPrimary?: boolean;
  altText?: string;
}

export interface ItemImageOrderUpdateRequest {
  imageIds: number[];
}

export async function createItem(request: ItemCreateRequest): Promise<ItemCreateResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<ItemCreateResponse>(response);
  return data.data!;
}

export async function addVariants(
  itemId: number,
  request: AddVariantsRequest,
): Promise<AddVariantsResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}/variants`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<AddVariantsResponse>(response);
  return data.data!;
}

export async function addImage(
  itemId: number,
  request: ItemImageCreateRequest,
): Promise<ItemImageResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}/images`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<ItemImageResponse>(response);
  return data.data!;
}

export async function getItem(itemId: number): Promise<ItemDetailResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}`);
  const data = await handleApiResponse<ItemDetailResponse>(response);
  return data.data!;
}

export async function updateItem(itemId: number, request: ItemUpdateRequest): Promise<ItemResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<ItemResponse>(response);
  return data.data!;
}

export async function updateItemStatus(
  itemId: number,
  request: ItemStatusUpdateRequest,
): Promise<ItemResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<ItemResponse>(response);
  return data.data!;
}

export async function deleteItem(itemId: number): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}`, {
    method: 'DELETE',
  });
  await handleApiResponse<null>(response);
}

export async function getImages(itemId: number): Promise<ItemImageResponse[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}/images`);
  const data = await handleApiResponse<ItemImageResponse[]>(response);
  return data.data ?? [];
}

export async function updateImage(
  itemId: number,
  imageId: number,
  request: ItemImageUpdateRequest,
): Promise<ItemImageResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}/images/${imageId}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<ItemImageResponse>(response);
  return data.data!;
}

export async function deleteImage(itemId: number, imageId: number): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}/images/${imageId}`, {
    method: 'DELETE',
  });
  await handleApiResponse<null>(response);
}

export async function updateImageOrder(
  itemId: number,
  request: ItemImageOrderUpdateRequest,
): Promise<ItemImageResponse[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/catalog/item/${itemId}/images/order`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<ItemImageResponse[]>(response);
  return data.data ?? [];
}
