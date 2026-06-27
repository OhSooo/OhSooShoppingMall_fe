import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrder, OrderDetailResponse } from '../../../api/order/orderApi';
import PageTitle from '../../../components/common/PageTitle';
import SectionHeader from '../../../components/common/SectionHeader';
import Button from '../../../components/common/Button';

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--color-black)',
  marginBottom: '4px',
};

const valueStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--color-gray-4)',
  margin: '0 0 12px',
};

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

function formatDate(isoStr: string): string {
  return isoStr.slice(0, 10).replace(/-/g, '.');
}

export default function MyOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    getOrder(Number(orderId))
      .then(setOrder)
      .catch(() => setError('주문 정보를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
        <div
          className="page-card"
          style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-gray-4)', fontSize: '14px' }}
        >
          불러오는 중...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
        <div
          className="page-card"
          style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-point-main)', fontSize: '14px' }}
        >
          {error ?? '주문 정보를 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

  const { shipping } = order;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PageTitle
          title="Order"
          action={
            <Button
              variant="secondary"
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '6px' }}
              onClick={() => navigate('/mypage/order')}
            >
              ← 목록으로
            </Button>
          }
        />

        {/* 주문 정보 */}
        <SectionHeader title="주문 정보" />
        <div style={{ padding: '16px 24px 8px', borderBottom: '1px solid var(--color-gray-1)' }}>
          <p style={labelStyle}>주문 번호</p>
          <p style={valueStyle}>#{order.orderId}</p>
          <p style={labelStyle}>주문 일자</p>
          <p style={valueStyle}>{formatDate(order.createdAt)}</p>
          <p style={labelStyle}>주문 상태</p>
          <p style={{ ...valueStyle, marginBottom: '16px' }}>{statusLabel(order.status)}</p>
        </div>

        {/* 배송 정보 */}
        <SectionHeader title="배송 정보" />
        <div style={{ padding: '16px 24px 8px', borderBottom: '1px solid var(--color-gray-1)' }}>
          <p style={labelStyle}>배송지</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <p style={{ ...valueStyle, flex: 1, margin: 0 }}>{shipping?.shippingAddress ?? '-'}</p>
            {shipping?.shippingPostcode && (
              <p style={{ ...valueStyle, width: '100px', margin: 0 }}>{shipping.shippingPostcode}</p>
            )}
          </div>
          {shipping?.shippingAddressDetail && (
            <p style={{ ...valueStyle, marginBottom: '12px' }}>{shipping.shippingAddressDetail}</p>
          )}

          <p style={labelStyle}>수령인</p>
          <p style={valueStyle}>{shipping?.receiverName ?? '-'}</p>
          <p style={labelStyle}>전화번호</p>
          <p style={valueStyle}>{shipping?.receiverPhone ?? '-'}</p>

          {shipping?.requestNote && (
            <>
              <p style={labelStyle}>배송 메모</p>
              <p style={{ ...valueStyle, marginBottom: '16px' }}>{shipping.requestNote}</p>
            </>
          )}
        </div>

        {/* 주문 상품 */}
        <SectionHeader title="주문 상품" />
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--color-gray-1)' }}>
          {order.items.map((item) => (
            <div
              key={item.orderItemId}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--color-gray-1)',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--color-gray-0)',
                  border: '1px solid var(--color-gray-1)',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600 }}>{item.itemName}</p>
                {item.optionSummary && (
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-3)' }}>{item.optionSummary}</p>
                )}
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--color-gray-4)' }}>
                  {item.priceAtPurchase.toLocaleString()}원
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-4)' }}>× {item.quantity}</p>
              </div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, textAlign: 'right' }}>
                합계 {(item.priceAtPurchase * item.quantity).toLocaleString()}원
              </p>
            </div>
          ))}
        </div>

        {/* 결제 정보 */}
        <SectionHeader title="결제 정보" />
        <div style={{ padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px' }}>원 금액</span>
            <span style={{ fontSize: '14px' }}>{order.originalTotalPrice.toLocaleString()}원</span>
          </div>

          {order.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px' }}>할인</span>
              <span style={{ fontSize: '14px', color: 'var(--color-point-main)' }}>
                - {order.discountAmount.toLocaleString()}원
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px' }}>배송비</span>
            <span style={{ fontSize: '14px', color: 'var(--color-gray-4)' }}>
              {order.deliveryFee === 0 ? '무료' : `+ ${order.deliveryFee.toLocaleString()}원`}
            </span>
          </div>

          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--color-gray-0)',
              borderRadius: '6px',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '17px', fontWeight: 700 }}>
              총 {order.finalPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
