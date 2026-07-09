import type { CartItemResponse, CartResponse } from '../../api/cart/cartApi';

export interface CartItem {
  itemVariantId: number;
  itemName: string;
  price: number;
  storeId: number;
  storeName: string;
  optionLabel: string;
  quantity: number;
  saleable: boolean;
  total: number;
}

export interface CartStoreGroup {
  storeId: number;
  storeName: string;
  items: CartItem[];
  storeTotal: number;
}

export interface Cart {
  totalPrice: number;
  stores: CartStoreGroup[];
  items: CartItem[];
}

export const normalizeCartItem = (item: CartItemResponse): CartItem => ({
  itemVariantId: item.itemVariantId,
  itemName: item.itemName,
  price: item.price,
  storeId: item.storeId,
  storeName: item.storeName,
  optionLabel: item.options.map((o) => o.value).join(' / '),
  quantity: item.quantity,
  saleable: item.saleable,
  total: item.price * item.quantity,
});

export const normalizeCart = (cart: CartResponse): Cart => {
  const items = cart.items.map(normalizeCartItem);

  const storeMap = new Map<number, CartStoreGroup>();
  for (const item of items) {
    if (!storeMap.has(item.storeId)) {
      storeMap.set(item.storeId, {
        storeId: item.storeId,
        storeName: item.storeName,
        items: [],
        storeTotal: 0,
      });
    }
    const group = storeMap.get(item.storeId)!;
    group.items.push(item);
    group.storeTotal += item.total;
  }

  return {
    totalPrice: cart.totalPrice,
    stores: Array.from(storeMap.values()),
    items,
  };
};
