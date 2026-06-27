import { API_BASE_URL, authenticatedFetch, handleApiResponse } from '../config';

export interface PaymentCreateRequest {
  orderId: number;
  amount: number;
  currency: string;
  method: string;
  provider: string;
  orderName?: string;
  customerName?: string;
}

export interface PaymentCreateResponse {
  paymentId: number;
  orderId: number;
  status: string;
  amount: number;
  currency: string;
  method: string;
  provider: string;
  requestedAt: string;
  orderName?: string;
  customerName?: string;
  tossOrderId: string;
}

export interface PaymentConfirmRequest {
  paymentId?: number;
  orderId?: number;
  paymentKey: string;
  amount: number;
}

export interface PaymentConfirmResponse {
  paymentId: number;
  orderId: number;
  status: string;
  amount: number;
  currency: string;
  pgPaymentKey: string;
  pgTransactionId: string;
  approvedAt: string;
}

export interface PaymentInfo {
  paymentId: number;
  orderId: number;
  status: string;
  amount: number;
}

export async function createPayment(request: PaymentCreateRequest): Promise<PaymentCreateResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<PaymentCreateResponse>(response);
  return data.data!;
}

export async function confirmPayment(
  paymentId: number,
  request: PaymentConfirmRequest,
): Promise<PaymentConfirmResponse> {
  const response = await authenticatedFetch(`${API_BASE_URL}/payments/${paymentId}/confirm`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  const data = await handleApiResponse<PaymentConfirmResponse>(response);
  return data.data!;
}

export async function getPaymentByOrderId(orderId: number): Promise<PaymentInfo> {
  const response = await authenticatedFetch(`${API_BASE_URL}/payments/orders/${orderId}`);
  const data = await handleApiResponse<PaymentInfo>(response);
  return data.data!;
}
