import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/common/PageTitle';
import SectionHeader from '../../../components/common/SectionHeader';
import Button from '../../../components/common/Button';
import AddressInput, { type AddressValue } from '../../../components/common/AddressInput';
import { createOrder } from '../../../api/order/orderApi';
import type { PaymentPageState } from '../payment/PaymentPage';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid var(--color-gray-2)',
  borderRadius: '4px',
  outline: 'none',
  backgroundColor: 'var(--color-white)',
  color: 'var(--color-gray-4)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--color-black)',
  marginBottom: '6px',
  display: 'block',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '16px',
};

const COUPONS = [
  { id: 'coupon1', label: '20% 할인 쿠폰', desc: '10,000원 이상 구매시 사용 가능', type: 'percent' as const, value: 20 },
  { id: 'coupon2', label: '[핑크젤리] 1,000원 할인 쿠폰', desc: '', type: 'fixed' as const, value: 1000 },
];

const BASE_AMOUNT = 80000;
const AVAILABLE_MILEAGE = 7653;

export default function OrderPage() {
  const navigate = useNavigate();

  const [addressValue, setAddressValue] = useState<AddressValue>({
    shippingPostcode: '',
    address: '',
    shippingAddressDetail: '',
  });
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [deliveryMemo, setDeliveryMemo] = useState('');

  const [couponOpen, setCouponOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [mileage, setMileage] = useState('0');
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const coupon = COUPONS.find((c) => c.id === selectedCoupon) ?? null;
  const couponDiscount = coupon
    ? coupon.type === 'percent'
      ? Math.floor(BASE_AMOUNT * (coupon.value / 100))
      : coupon.value
    : 0;
  const mileageDiscount = Math.min(Number(mileage) || 0, AVAILABLE_MILEAGE);
  const totalAmount = Math.max(0, BASE_AMOUNT - couponDiscount - mileageDiscount);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PageTitle title="Order" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 0 4px' }}>

          {/* 배송 정보 */}
          <div>
            <SectionHeader title="배송 정보" />
            <div style={{ padding: '20px 24px 8px' }}>
              <div style={fieldStyle}>
                <AddressInput
                  label="배송지"
                  value={addressValue}
                  onChange={setAddressValue}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>수령인</label>
                <input
                  style={inputStyle}
                  placeholder="받는 분 성함"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>전화번호</label>
                <input
                  style={inputStyle}
                  placeholder="000-0000-0000"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                />
              </div>
              <div style={{ ...fieldStyle, marginBottom: '20px' }}>
                <label style={labelStyle}>배송 메모</label>
                <input
                  style={inputStyle}
                  placeholder="EX) 부재중엔 경비실에 맡겨주세요."
                  value={deliveryMemo}
                  onChange={(e) => setDeliveryMemo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 주문 상품 */}
          <div>
            <SectionHeader title="주문 상품" />
            <div style={{ padding: '12px 24px' }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-gray-1)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>멍멍망망밍샵</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-gray-4)' }}>상품 80,000원 + 배송비 0원 = 80,000원</span>
                </div>
                {[
                  { name: '로얄캐닌', option: '대형견 (+ 5000)', price: 25000, qty: 1, total: 30000 },
                  { name: '로얄캐닌', option: '소형견', price: 25000, qty: 2, total: 50000 },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-gray-1)', gap: '12px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '4px', backgroundColor: 'var(--color-gray-0)', border: '1px solid var(--color-gray-1)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600 }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-4)' }}>{item.price.toLocaleString()}원</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-3)' }}>{item.option}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-gray-4)' }}>X {item.qty}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Button variant="secondary" style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', marginBottom: '6px' }}>
                        옵션 변경
                      </Button>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>합계 {item.total.toLocaleString()}원</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 할인 */}
          <div>
            <SectionHeader title="할인" />
            <div style={{ padding: '16px 24px' }}>

          {/* 할인 쿠폰 아코디언 */}
          <div style={fieldStyle}>
            <button
              type="button"
              onClick={() => setCouponOpen((prev) => !prev)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <span style={labelStyle as React.CSSProperties}>할인 쿠폰</span>
              <span style={{ fontSize: '13px', color: 'var(--color-gray-4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {selectedCoupon
                  ? COUPONS.find((c) => c.id === selectedCoupon)?.label
                  : '선택 안 함'}
                <span style={{ fontSize: '11px', transition: 'transform 0.25s ease', display: 'inline-block', transform: couponOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </span>
            </button>

            {/* 아코디언 — max-height transition으로 부드럽게 */}
            <div
              style={{
                maxHeight: couponOpen ? '300px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.25s ease',
              }}
            >
              <div
                style={{
                  marginTop: '10px',
                  border: '1px solid var(--color-gray-1)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--color-gray-1)',
                    backgroundColor: selectedCoupon === null ? 'var(--color-point-sub)' : 'var(--color-white)',
                  }}
                >
                  <input
                    type="radio"
                    name="coupon"
                    checked={selectedCoupon === null}
                    onChange={() => setSelectedCoupon(null)}
                    style={{ accentColor: 'var(--color-point-main)', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--color-gray-4)' }}>사용 안 함</span>
                </label>

                {COUPONS.map((coupon, i) => (
                  <label
                    key={coupon.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: i < COUPONS.length - 1 ? '1px solid var(--color-gray-1)' : 'none',
                      backgroundColor: selectedCoupon === coupon.id ? 'var(--color-point-sub)' : 'var(--color-white)',
                    }}
                  >
                    <input
                      type="radio"
                      name="coupon"
                      checked={selectedCoupon === coupon.id}
                      onChange={() => setSelectedCoupon(coupon.id)}
                      style={{ accentColor: 'var(--color-point-main)', width: '16px', height: '16px' }}
                    />
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--color-black)' }}>
                        {coupon.label}
                      </p>
                      {coupon.desc && (
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-gray-3)' }}>
                          {coupon.desc}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 마일리지 */}
          <div style={{ ...fieldStyle, marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>
              마일리지{' '}
              <span style={{ fontSize: '13px', color: 'var(--color-point-main)', fontWeight: 400 }}>
                보유 : {AVAILABLE_MILEAGE.toLocaleString()}
              </span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                inputMode="numeric"
                value={mileage}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  const num = Math.min(Number(digits) || 0, AVAILABLE_MILEAGE);
                  setMileage(digits === '' ? '0' : String(num));
                }}
                style={{ ...inputStyle, width: '120px', flex: 'none' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--color-gray-4)' }}>원</span>
              <button
                type="button"
                onClick={() => setMileage(String(AVAILABLE_MILEAGE))}
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-point-main)',
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-point-main)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                전액 사용
              </button>
            </div>
          </div>

            </div>
          </div>

          {/* 가름선 */}
          <hr style={{ margin: '0 24px', border: 'none', borderTop: '1px solid var(--color-gray-1)' }} />

          {/* 결제 금액 요약 */}
          <div style={{ padding: '16px 24px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-black)' }}>원 금액</span>
            <span style={{ fontSize: '14px', color: 'var(--color-black)' }}>{BASE_AMOUNT.toLocaleString()}원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-black)' }}>쿠폰 할인</span>
            <span style={{ fontSize: '14px', color: couponDiscount > 0 ? 'var(--color-point-main)' : 'var(--color-gray-4)' }}>
              - {couponDiscount.toLocaleString()}원
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-black)' }}>마일리지 적용</span>
            <span style={{ fontSize: '14px', color: mileageDiscount > 0 ? 'var(--color-point-main)' : 'var(--color-gray-4)' }}>
              - {mileageDiscount.toLocaleString()}원
            </span>
          </div>

          {orderError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                marginBottom: '12px',
                backgroundColor: '#fff5f5',
                border: '1px solid #fc8181',
                borderRadius: '6px',
                color: '#c53030',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {orderError}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: 'var(--color-gray-0)',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-black)' }}>
              총 {totalAmount.toLocaleString()}원
            </span>
            <Button
              variant="primary"
              disabled={ordering}
              onClick={async () => {
                if (!addressValue.address || !receiverName || !receiverPhone) {
                  setOrderError('배송지, 수령인, 전화번호를 입력해 주세요.');
                  return;
                }
                setOrdering(true);
                setOrderError(null);
                try {
                  const order = await createOrder({
                    source: 'CART_ALL',
                    memo: deliveryMemo || undefined,
                    shipping: {
                      receiverName,
                      receiverPhone,
                      shippingAddress: addressValue.address,
                      shippingPostcode: addressValue.shippingPostcode || undefined,
                      shippingAddressDetail: addressValue.shippingAddressDetail || undefined,
                      requestNote: deliveryMemo || undefined,
                    },
                  });
                  const state: PaymentPageState = {
                    orderId: order.orderId,
                    finalPrice: order.finalPrice,
                    orderName: `오쑤 쇼핑몰 주문 ${order.orderId}`,
                    customerName: receiverName,
                  };
                  navigate('/payment', { state });
                } catch (err) {
                  const msg = err instanceof Error ? err.message : '주문 생성에 실패했습니다.';
                  setOrderError(msg);
                  setOrdering(false);
                }
              }}
              style={{ padding: '10px 28px' }}
            >
              {ordering ? '처리 중...' : '주문'}
            </Button>
          </div>
          </div>

        </div>
      </div>
    </div>
  );
}
