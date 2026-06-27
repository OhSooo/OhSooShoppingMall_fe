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
  itemVariantId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  source: 'CART_ALL' | 'CART_SELECTED' | 'DIRECT';
  cartItemIds?: number[];
  items?: OrderItemCreateRequest[];
  memo?: string;
  shipping?: ShippingInfo;
}

export interface OrderItemOptionResponse {
  type: string;
  value: string;
}

export interface OrderItemResponse {
  orderItemId: number;
  itemId: number;
  itemVariantId: number;
  sku: string;
  itemName: string;
  optionSummary: string;
  priceAtPurchase: number;
  quantity: number;
  options: OrderItemOptionResponse[];
  status: string;
  saleable: boolean;
  cancelable: boolean;
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

export interface OrderListItemResponse {
  orderId: number;
  status: string;
  finalPrice: number;
  createdAt: string;
  summary: string;
}

export interface OrderDetailShippingInfo {
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  shippingPostcode: string;
  shippingAddressDetail: string;
  requestNote: string;
}

export interface OrderDetailResponse {
  orderId: number;
  userId: number;
  status: string;
  originalTotalPrice: number;
  discountAmount: number;
  deliveryFee: number;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
  shipping: OrderDetailShippingInfo;
  items: OrderItemResponse[];
}

export async function createOrder(request: OrderCreateRequest): Promise<OrderCreateResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<OrderCreateResponse>(response);
  return data.data!;
}

export async function getOrders(): Promise<OrderListItemResponse[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/orders`);
  const data = await handleApiResponse<OrderListItemResponse[]>(response);
  return data.data ?? [];
}

export async function getOrder(orderId: number): Promise<OrderDetailResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}`);
  const data = await handleApiResponse<OrderDetailResponse>(response);
  return data.data!;
}
