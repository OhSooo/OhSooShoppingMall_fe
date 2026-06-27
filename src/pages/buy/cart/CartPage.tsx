import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/common/PageTitle';
import Button from '../../../components/common/Button';

// unitPrice = 옵션 포함 개당 가격
const INITIAL_STORES = [
  {
    id: 1,
    name: '핑크젤리',
    shipping: 3000,
    items: [
      { id: 1, name: '로얄캐닌', option: '중형견 (+ 2000)', price: 26000, unitPrice: 28000, qty: 1 },
    ],
  },
  {
    id: 2,
    name: '멍멍망망밍샵',
    shipping: 0,
    items: [
      { id: 2, name: '로얄캐닌', option: '대형견 (+ 5000)', price: 25000, unitPrice: 30000, qty: 1 },
      { id: 3, name: '로얄캐닌', option: '소형견', price: 25000, unitPrice: 25000, qty: 2 },
    ],
  },
];

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

  const [stores, setStores] = useState(INITIAL_STORES);
  const [checked, setChecked] = useState<Record<number, boolean>>(
    Object.fromEntries(INITIAL_STORES.flatMap((s) => s.items.map((i) => [i.id, true])))
  );

  // 현재 stores 기준 전체 item id 목록
  const allItemIds = stores.flatMap((s) => s.items.map((i) => i.id));
  const checkedCount = allItemIds.filter((id) => checked[id]).length;
  const allChecked = allItemIds.length > 0 && allItemIds.every((id) => checked[id]);

  /* ── 체크 핸들러 ── */
  const toggleAll = () => {
    const next = !allChecked;
    setChecked((prev) => ({ ...prev, ...Object.fromEntries(allItemIds.map((id) => [id, next])) }));
  };

  const toggleStore = (storeId: number) => {
    const store = stores.find((s) => s.id === storeId)!;
    const ids = store.items.map((i) => i.id);
    const allStoreChecked = ids.every((id) => checked[id]);
    setChecked((prev) => ({ ...prev, ...Object.fromEntries(ids.map((id) => [id, !allStoreChecked])) }));
  };

  const toggleItem = (itemId: number) => {
    setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  /* ── 수량 핸들러 ── */
  const changeQty = (itemId: number, delta: number) => {
    setStores((prev) =>
      prev.map((store) => ({
        ...store,
        items: store.items.map((item) =>
          item.id === itemId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        ),
      }))
    );
  };

  /* ── 삭제 핸들러 ── */
  const deleteItem = (itemId: number) => {
    setStores((prev) =>
      prev
        .map((store) => ({ ...store, items: store.items.filter((i) => i.id !== itemId) }))
        .filter((store) => store.items.length > 0) // 빈 스토어 제거
    );
    setChecked((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const deleteStore = (storeId: number) => {
    const store = stores.find((s) => s.id === storeId)!;
    const ids = store.items.map((i) => i.id);
    setStores((prev) => prev.filter((s) => s.id !== storeId));
    setChecked((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });
  };

  /* ── 최종 금액 계산 ── */
  const { itemTotal, shippingTotal } = stores.reduce(
    (acc, store) => {
      const checkedItems = store.items.filter((i) => checked[i.id]);
      if (checkedItems.length === 0) return acc;
      return {
        itemTotal: acc.itemTotal + checkedItems.reduce((s, i) => s + i.unitPrice * i.qty, 0),
        shippingTotal: acc.shippingTotal + store.shipping,
      };
    },
    { itemTotal: 0, shippingTotal: 0 }
  );
  const grandTotal = itemTotal + shippingTotal;

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

        {/* 장바구니 비었을 때 */}
        {stores.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-gray-3)', fontSize: '15px' }}>
            장바구니가 비어있습니다
          </div>
        )}

        <div style={{ padding: '20px 0' }}>
          {stores.map((store) => {
            const storeItemIds = store.items.map((i) => i.id);
            const allStoreChecked = storeItemIds.every((id) => checked[id]);
            const someStoreChecked = storeItemIds.some((id) => checked[id]);
            const storeTotal = store.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

            return (
              <div key={store.id} style={{ marginBottom: '8px' }}>
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
                      ref={(el) => { if (el) el.indeterminate = !allStoreChecked && someStoreChecked; }}
                      onChange={() => toggleStore(store.id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-black)' }}>
                      {store.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-gray-4)' }}>
                      상품 {storeTotal.toLocaleString()}원 + 배송비{' '}
                      {store.shipping.toLocaleString()}원 ={' '}
                      {(storeTotal + store.shipping).toLocaleString()}원
                    </span>
                    {/* 스토어 전체 삭제 버튼 */}
                    <button
                      style={delBtn}
                      onClick={() => deleteStore(store.id)}
                      title="스토어 상품 전체 삭제"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* 상품 목록 */}
                {store.items.map((item) => {
                  const itemTotal = item.unitPrice * item.qty;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '14px 20px',
                        borderBottom: '1px solid var(--color-gray-1)',
                        gap: '12px',
                        backgroundColor: checked[item.id] ? 'var(--color-white)' : 'var(--color-gray-0)',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked[item.id] ?? false}
                        onChange={() => toggleItem(item.id)}
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
                          {item.name}
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-gray-4)' }}>
                          {item.unitPrice.toLocaleString()}원
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-3)' }}>
                          {item.option}
                        </p>
                      </div>
                      {/* 수량 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button style={qBtn} onClick={() => changeQty(item.id, -1)}>‹</button>
                        <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button style={qBtn} onClick={() => changeQty(item.id, 1)}>›</button>
                      </div>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: checked[item.id] ? 'var(--color-black)' : 'var(--color-gray-3)',
                          minWidth: '80px',
                          textAlign: 'right',
                          transition: 'color 0.15s',
                        }}
                      >
                        {itemTotal.toLocaleString()}원
                      </span>
                      {/* 상품 개별 삭제 버튼 */}
                      <button
                        style={delBtn}
                        onClick={() => deleteItem(item.id)}
                        title="상품 삭제"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
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
          <span style={{ fontSize: '13px', color: 'var(--color-gray-4)' }}>
            상품 {itemTotal.toLocaleString()}원 + 배송비 {shippingTotal.toLocaleString()}원 =
          </span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-black)' }}>
            총 {grandTotal.toLocaleString()}원
          </span>
          <Button
            variant="primary"
            onClick={() => navigate('/order')}
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
