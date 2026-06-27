import type { OrderItemResponse, OrderCreateResponse } from '../../api/order/orderApi';

export interface OrderItem {
  orderItemId: number;
  itemVariantId: number;
  itemName: string;
  optionSummary: string;
  priceAtPurchase: number;
  quantity: number;
  total: number;
}

export interface Order {
  orderId: number;
  status: string;
  originalTotalPrice: number;
  discountAmount: number;
  deliveryFee: number;
  finalPrice: number;
  items: OrderItem[];
}

export const normalizeOrderItem = (item: OrderItemResponse): OrderItem => ({
  orderItemId: item.orderItemId,
  itemVariantId: item.itemVariantId,
  itemName: item.itemName,
  optionSummary: item.optionSummary,
  priceAtPurchase: item.priceAtPurchase,
  quantity: item.quantity,
  total: item.priceAtPurchase * item.quantity,
});

export const normalizeOrder = (order: OrderCreateResponse): Order => ({
  orderId: order.orderId,
  status: order.status,
  originalTotalPrice: order.originalTotalPrice,
  discountAmount: order.discountAmount,
  deliveryFee: order.deliveryFee,
  finalPrice: order.finalPrice,
  items: order.items.map(normalizeOrderItem),
});
