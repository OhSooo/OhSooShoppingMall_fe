import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';
import { getOrders, OrderListItemResponse } from '../../../api/order/orderApi';

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    CREATED: '결제 대기',
    PAID: '결제 완료',
    COMPLETED: '구매 완료',
    CANCELED: '주문 취소',
    PARTIALLY_CANCELED: '일부 취소',
    PARTIALLY_REFUNDED: '일부 환불',
  };
  return map[status] ?? status;
}

function statusColor(status: string): string {
  if (status === 'PAID') return 'var(--color-point-main)';
  if (status === 'COMPLETED') return '#10b981';
  if (status === 'CREATED') return '#f59e0b';
  if (['CANCELED', 'PARTIALLY_CANCELED', 'PARTIALLY_REFUNDED'].includes(status)) return '#ef4444';
  return 'var(--color-gray-3)';
}

function formatDate(isoStr: string): string {
  return isoStr.slice(0, 10).replace(/-/g, '.');
}

export default function MyOrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setError('주문 내역을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <button
            type="button"
            onClick={() => navigate('/mypage')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: '18px',
              color: 'var(--color-black)',
              lineHeight: 1,
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>
            주문 내역
          </h1>
        </div>

        {loading && (
          <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-gray-4)', fontSize: '14px' }}>
            불러오는 중...
          </p>
        )}

        {error && (
          <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-point-main)', fontSize: '14px' }}>
            {error}
          </p>
        )}

        {!loading && !error && orders.length === 0 && (
          <p style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-gray-3)', fontSize: '15px' }}>
            주문 내역이 없습니다.
          </p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((order) => {
              const color = statusColor(order.status);
              return (
                <div
                  key={order.orderId}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/mypage/order/${order.orderId}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/mypage/order/${order.orderId}`)}
                  style={{
                    padding: '20px 24px',
                    border: '2px solid var(--color-gray-2)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-white)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-point-main)';
                    e.currentTarget.style.backgroundColor = 'var(--color-point-back)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-gray-2)';
                    e.currentTarget.style.backgroundColor = 'var(--color-white)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-gray-3)' }}>
                        {formatDate(order.createdAt)}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color,
                          backgroundColor: color + '1a',
                          padding: '2px 9px',
                          borderRadius: '12px',
                        }}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-gray-3)' }}>
                      주문 #{order.orderId}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '0 0 10px',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--color-black)',
                    }}
                  >
                    {order.summary}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-black)' }}>
                      {order.finalPrice.toLocaleString()}원
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--color-point-main)', fontWeight: 600 }}>
                      상세 보기 →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
