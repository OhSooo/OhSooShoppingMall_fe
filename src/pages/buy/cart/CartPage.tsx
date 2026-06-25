import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/common/PageTitle';
import SectionHeader from '../../../components/common/SectionHeader';
import Button from '../../../components/common/Button';

const MOCK_STORES = [
  {
    id: 1,
    name: '핑크젤리',
    shipping: 3000,
    items: [
      { id: 1, name: '로얄캐닌', option: '중형견 (+ 2000)', price: 26000, qty: 1, total: 28000, checked: false },
    ],
  },
  {
    id: 2,
    name: '멍멍망망밍샵',
    shipping: 0,
    items: [
      { id: 2, name: '로얄캐닌', option: '대형견 (+ 5000)', price: 25000, qty: 1, total: 30000, checked: true },
      { id: 3, name: '로얄캐닌', option: '소형견', price: 25000, qty: 2, total: 50000, checked: true },
    ],
  },
];

function QuantityControl({ qty }: { qty: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button style={qBtn}>‹</button>
      <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
      <button style={qBtn}>›</button>
    </div>
  );
}

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

export default function CartPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PageTitle title="Cart" />

        {/* 전체 선택 헤더 */}
        <SectionHeader title="☑ 선택 (2)" />

        <div style={{ padding: '20px 0' }}>
          {MOCK_STORES.map((store) => (
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
                  <input type="checkbox" defaultChecked={store.items.some((i) => i.checked)} style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-black)' }}>{store.name}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-gray-4)' }}>
                  상품 {store.items.reduce((s, i) => s + i.total, 0).toLocaleString()}원 + 배송비 {store.shipping.toLocaleString()}원 ={' '}
                  {(store.items.reduce((s, i) => s + i.total, 0) + store.shipping).toLocaleString()}원
                </span>
              </div>

              {/* 상품 목록 */}
              {store.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--color-gray-1)',
                    gap: '12px',
                    backgroundColor: 'var(--color-white)',
                  }}
                >
                  <input type="checkbox" defaultChecked={item.checked} style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  {/* 상품 이미지 */}
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-gray-0)',
                      border: '1px solid var(--color-gray-1)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: 'var(--color-black)' }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-gray-4)' }}>{item.price.toLocaleString()}원</p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-3)' }}>{item.option}</p>
                  </div>
                  <QuantityControl qty={item.qty} />
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-black)', minWidth: '80px', textAlign: 'right' }}>
                    {item.total.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          ))}
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
            상품 28,000원 + 배송비 3,000원 =
          </span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-black)' }}>
            총 31,000원
          </span>
          <Button variant="primary" onClick={() => navigate('/order')} style={{ padding: '10px 28px' }}>
            주문
          </Button>
        </div>
      </div>
    </div>
  );
}
