import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface CartItemAddRequest {
  itemVariantId: number;
  quantity: number;
}

export interface CartItemUpdateRequest {
  quantity: number;
}

export interface CartItemOptionResponse {
  type: string;
  value: string;
}

export interface CartItemResponse {
  cartItemId: number;
  itemVariantId: number;
  itemName: string;
  price: number;
  storeId: number;
  storeName: string;
  options: CartItemOptionResponse[];
  quantity: number;
  saleable: boolean;
}

export interface CartResponse {
  cartId: number;
  userId: number;
  totalPrice: number;
  items: CartItemResponse[];
}

export async function getCart(): Promise<CartResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/cart`);
  const data = await handleApiResponse<CartResponse>(response);
  return data.data!;
}

export async function addCartItem(request: CartItemAddRequest): Promise<CartResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/cart/items`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<CartResponse>(response);
  return data.data!;
}

export async function updateCartItemQuantity(
  cartItemId: number,
  request: CartItemUpdateRequest,
): Promise<CartResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<CartResponse>(response);
  return data.data!;
}

export async function deleteCartItem(cartItemId: number): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? '장바구니 삭제에 실패했습니다.');
  }
}

export async function clearCart(): Promise<void> {
  const response = await authenticatedFetch(`${API_BASE_URL}/cart/items`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? '장바구니 비우기에 실패했습니다.');
  }
}
