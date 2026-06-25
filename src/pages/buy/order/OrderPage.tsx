import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/common/PageTitle';
import SectionHeader from '../../../components/common/SectionHeader';
import Button from '../../../components/common/Button';
import AddressInput, { type AddressValue } from '../../../components/common/AddressInput';

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

export default function OrderPage() {
  const navigate = useNavigate();

  const [addressValue, setAddressValue] = useState<AddressValue>({
    shippingPostcode: '',
    address: '',
    shippingAddressDetail: '',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PageTitle title="Order" />

        {/* 배송 정보 */}
        <SectionHeader title="배송 정보" />
        <div style={{ padding: '20px 24px 8px', borderBottom: '1px solid var(--color-gray-1)' }}>
          <div style={fieldStyle}>
            <AddressInput
              label="배송지"
              value={addressValue}
              onChange={setAddressValue}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>수령인</label>
            <input style={inputStyle} placeholder="받는 분 성함" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>전화번호</label>
            <input style={inputStyle} placeholder="000-0000-0000" />
          </div>
          <div style={{ ...fieldStyle, marginBottom: '20px' }}>
            <label style={labelStyle}>배송 메모</label>
            <input style={inputStyle} placeholder="EX) 부재중엔 경비실에 맡겨주세요." />
          </div>
        </div>

        {/* 주문 상품 */}
        <SectionHeader title="주문 상품" />
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--color-gray-1)' }}>
          {/* 스토어 */}
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

        {/* 할인 */}
        <SectionHeader title="할인" />
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-gray-1)' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>할인 쿠폰</label>
            <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--color-gray-3)' }}>사용가능한 쿠폰이 없습니다.</p>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--color-gray-5)' }}>20% 할인 쿠폰 (10,000원 이상 구매시 사용 가능)</p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-gray-5)' }}>[핑크젤리] 1,000원 할인 쿠폰</p>
          </div>
          <div style={{ ...fieldStyle, marginBottom: 0 }}>
            <label style={labelStyle}>
              마일리지{' '}
              <span style={{ fontSize: '13px', color: 'var(--color-point-main)', fontWeight: 400 }}>
                보유 마일리지 : 7,653
              </span>
            </label>
            <input style={inputStyle} placeholder="EX) 부재중엔 경비실에 맡겨주세요." />
          </div>
        </div>

        {/* 결제 금액 요약 */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-black)' }}>원 금액</span>
            <span style={{ fontSize: '14px', color: 'var(--color-black)' }}>31,000원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-black)' }}>쿠폰 할인</span>
            <span style={{ fontSize: '14px', color: 'var(--color-gray-4)' }}>- 0원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-black)' }}>마일리지 적용</span>
            <span style={{ fontSize: '14px', color: 'var(--color-gray-4)' }}>- 0원</span>
          </div>

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
            <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-black)' }}>총 31,000원</span>
            <Button variant="primary" onClick={() => navigate('/payment')} style={{ padding: '10px 28px' }}>
              주문
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
