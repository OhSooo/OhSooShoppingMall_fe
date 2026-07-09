import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/common/PageTitle';
import Button from '../../../components/common/Button';
import { getCart, updateCartItemQuantity, deleteCartItem } from '../../../api/cart/cartApi';
import { normalizeCart, type CartStoreGroup } from '../../../services/cart/normalizeCart';
import type { OrderPageState } from '../order/OrderPage';

const qBtn: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  border: '1px solid var(--color-gray-2)',
  backgroundColor: 'var(--color-white)',
  cursor: 'pointer',
  fontSize: '16px',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
};

const delBtn: React.CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  border: '1px solid var(--color-gray-2)',
  backgroundColor: 'var(--color-white)',
  cursor: 'pointer',
  fontSize: '14px',
  color: 'var(--color-gray-4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  flexShrink: 0,
};

export default function CartPage() {
  const navigate = useNavigate();

  const [stores, setStores] = useState<CartStoreGroup[]>([]);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const cartResponse = await getCart();
      const cart = normalizeCart(cartResponse);
      setStores(cart.stores);
      setChecked(Object.fromEntries(cart.items.map((i) => [i.cartItemId, true])));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : '장바구니를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const allItems = stores.flatMap((s) => s.items);
  const allItemIds = allItems.map((i) => i.cartItemId);
  const allChecked = allItemIds.length > 0 && allItemIds.every((id) => checked[id]);
  const checkedCount = allItemIds.filter((id) => checked[id]).length;

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(Object.fromEntries(allItemIds.map((id) => [id, next])));
  };

  const toggleStore = (storeId: number) => {
    const store = stores.find((s) => s.storeId === storeId)!;
    const ids = store.items.map((i) => i.cartItemId);
    const allStoreChecked = ids.every((id) => checked[id]);
    setChecked((prev) => ({ ...prev, ...Object.fromEntries(ids.map((id) => [id, !allStoreChecked])) }));
  };

  const toggleItem = (cartItemId: number) => {
    setChecked((prev) => ({ ...prev, [cartItemId]: !prev[cartItemId] }));
  };

  const changeQty = async (cartItemId: number, delta: number) => {
    const item = allItems.find((i) => i.cartItemId === cartItemId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    if (newQty === item.quantity) return;

    // 옵티미스틱 업데이트
    setStores((prev) =>
      prev.map((s) => ({
        ...s,
        items: s.items.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: newQty, total: i.price * newQty } : i,
        ),
        storeTotal: s.items.reduce(
          (sum, i) => sum + (i.cartItemId === cartItemId ? i.price * newQty : i.total),
          0,
        ),
      })),
    );

    try {
      const cartResponse = await updateCartItemQuantity(cartItemId, { quantity: newQty });
      const cart = normalizeCart(cartResponse);
      setStores(cart.stores);
    } catch (err) {
      // 실패 시 원복
      setStores((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.cartItemId === cartItemId
              ? { ...i, quantity: item.quantity, total: item.price * item.quantity }
              : i,
          ),
          storeTotal: s.items.reduce(
            (sum, i) => sum + (i.cartItemId === cartItemId ? item.price * item.quantity : i.total),
            0,
          ),
        })),
      );
      alert(err instanceof Error ? err.message : '수량 변경에 실패했습니다.');
    }
  };

  const deleteItem = async (cartItemId: number) => {
    // 옵티미스틱 삭제
    setStores((prev) =>
      prev
        .map((s) => {
          const items = s.items.filter((i) => i.cartItemId !== cartItemId);
          return { ...s, items, storeTotal: items.reduce((sum, i) => sum + i.total, 0) };
        })
        .filter((s) => s.items.length > 0),
    );
    setChecked((prev) => {
      const next = { ...prev };
      delete next[cartItemId];
      return next;
    });

    try {
      await deleteCartItem(cartItemId);
    } catch (err) {
      await loadCart();
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  const deleteStore = async (storeId: number) => {
    const store = stores.find((s) => s.storeId === storeId);
    if (!store) return;

    const ids = store.items.map((i) => i.cartItemId);

    // 옵티미스틱 삭제
    setStores((prev) => prev.filter((s) => s.storeId !== storeId));
    setChecked((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });

    try {
      await Promise.all(ids.map((id) => deleteCartItem(id)));
    } catch (err) {
      await loadCart();
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  const checkedItems = allItems.filter((i) => checked[i.cartItemId]);
  const checkedTotal = checkedItems.reduce((s, i) => s + i.total, 0);

  const handleOrder = () => {
    if (checkedItems.length === 0) return;
    const state: OrderPageState = {
      cartItemIds: checkedItems.map((i) => i.cartItemId),
      items: checkedItems,
      originalTotalPrice: checkedTotal,
    };
    navigate('/order', { state });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
        <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
          <PageTitle title="Cart" />
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-gray-3)', fontSize: '15px' }}>
            불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
        <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
          <PageTitle title="Cart" />
          <div style={{ padding: '60px', textAlign: 'center', color: '#c53030', fontSize: '15px' }}>
            {fetchError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PageTitle title="Cart" />

        {/* 전체 선택 헤더 */}
        <div
          style={{
            backgroundColor: 'var(--color-point-main)',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#fff' }}
          />
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
            선택 ({checkedCount})
          </span>
        </div>

        {stores.length === 0 && (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: 'var(--color-gray-3)',
              fontSize: '15px',
            }}
          >
            장바구니가 비어있습니다
          </div>
        )}

        <div style={{ padding: '20px 0' }}>
          {stores.map((store) => {
            const storeItemIds = store.items.map((i) => i.cartItemId);
            const allStoreChecked = storeItemIds.every((id) => checked[id]);
            const someStoreChecked = storeItemIds.some((id) => checked[id]);

            return (
              <div key={store.storeId ?? store.storeName} style={{ marginBottom: '8px' }}>
                {/* 스토어 행 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-gray-0)',
                    borderTop: '1px solid var(--color-gray-1)',
                    borderBottom: '1px solid var(--color-gray-1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={allStoreChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = !allStoreChecked && someStoreChecked;
                      }}
                      onChange={() => toggleStore(store.storeId)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-black)' }}>
                      {store.storeName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-gray-4)' }}>
                      {store.storeTotal.toLocaleString()}원
                    </span>
                    <button
                      style={delBtn}
                      onClick={() => deleteStore(store.storeId)}
                      title="스토어 상품 전체 삭제"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* 상품 목록 */}
                {store.items.map((item) => (
                  <div
                    key={item.cartItemId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--color-gray-1)',
                      gap: '12px',
                      backgroundColor: checked[item.cartItemId] ? 'var(--color-white)' : 'var(--color-gray-0)',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked[item.cartItemId] ?? false}
                      onChange={() => toggleItem(item.cartItemId)}
                      style={{ width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
                    />
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--color-gray-1)',
                        border: '1px solid var(--color-gray-2)',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: 'var(--color-black)' }}>
                        {item.itemName}
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-gray-4)' }}>
                        {item.price.toLocaleString()}원
                      </p>
                      {item.optionLabel && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-3)' }}>
                          {item.optionLabel}
                        </p>
                      )}
                      {!item.saleable && (
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#c53030', fontWeight: 500 }}>
                          품절
                        </p>
                      )}
                    </div>
                    {/* 수량 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button style={qBtn} onClick={() => changeQty(item.cartItemId, -1)}>
                        ‹
                      </button>
                      <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button style={qBtn} onClick={() => changeQty(item.cartItemId, 1)}>
                        ›
                      </button>
                    </div>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: checked[item.cartItemId] ? 'var(--color-black)' : 'var(--color-gray-3)',
                        minWidth: '80px',
                        textAlign: 'right',
                        transition: 'color 0.15s',
                      }}
                    >
                      {item.total.toLocaleString()}원
                    </span>
                    <button
                      style={delBtn}
                      onClick={() => deleteItem(item.cartItemId)}
                      title="상품 삭제"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* 가격 합계 */}
        <div
          style={{
            padding: '20px 28px',
            borderTop: '1px solid var(--color-gray-1)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-black)' }}>
            총 {checkedTotal.toLocaleString()}원
          </span>
          <Button
            variant="primary"
            onClick={handleOrder}
            disabled={checkedCount === 0}
            style={{ padding: '10px 28px' }}
          >
            주문
          </Button>
        </div>
      </div>
    </div>
  );
}
