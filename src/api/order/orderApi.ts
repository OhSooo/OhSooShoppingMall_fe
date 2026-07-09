import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface ShippingInfo {
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  shippingPostcode?: string;
  shippingAddressDetail?: string;
  requestNote?: string;
}

export interface OrderItemCreateRequest {
  variantId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  source: 'CART_ALL' | 'CART_SELECTED' | 'DIRECT';
  cartItemIds?: number[];
  items?: OrderItemCreateRequest[];
  memo?: string;
  shipping?: ShippingInfo;
}

export interface OrderItemResponse {
  orderItemId: number;
  itemName: string;
  quantity: number;
  priceAtPurchase: number;
  totalPrice: number;
}

export interface OrderCreateResponse {
  orderId: number;
  status: string;
  originalTotalPrice: number;
  discountAmount: number;
  deliveryFee: number;
  finalPrice: number;
  items: OrderItemResponse[];
  paymentRedirectHint: string | null;
}

export async function createOrder(request: OrderCreateRequest): Promise<OrderCreateResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<OrderCreateResponse>(response);
  return data.data!;
}
