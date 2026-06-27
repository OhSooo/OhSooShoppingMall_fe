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

export default function MyOrderPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PageTitle
          title="Order"
          action={
            <Button variant="secondary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '6px' }}>
              주문 취소 / 환불 / 교환
            </Button>
          }
        />

        {/* 주문 정보 */}
        <SectionHeader title="주문 정보" />
        <div style={{ padding: '16px 24px 8px', borderBottom: '1px solid var(--color-gray-1)' }}>
          <p style={labelStyle}>주문 번호</p>
          <p style={valueStyle}>주소</p>
          <p style={labelStyle}>주문 일자</p>
          <p style={{ ...valueStyle, marginBottom: '16px' }}>받는 분 성함</p>
        </div>

        {/* 배송 정보 */}
        <SectionHeader title="배송 정보" />
        <div style={{ padding: '16px 24px 8px', borderBottom: '1px solid var(--color-gray-1)' }}>
          <p style={labelStyle}>배송지</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <p style={{ ...valueStyle, flex: 1, margin: 0 }}>주소</p>
            <p style={{ ...valueStyle, width: '100px', margin: 0 }}>우편번호</p>
          </div>
          <p style={{ ...valueStyle, marginBottom: '12px' }}>상세 주소</p>

          <p style={labelStyle}>수령인</p>
          <p style={valueStyle}>받는 분 성함</p>
          <p style={labelStyle}>전화번호</p>
          <p style={valueStyle}>000-0000-0000</p>
          <p style={labelStyle}>배송 메모</p>
          <p style={{ ...valueStyle, marginBottom: '16px' }}>EX) 부재중엔 경비실에 맡겨주세요.</p>
        </div>

        {/* 주문 상품 */}
        <SectionHeader title="주문 상품" />
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--color-gray-1)' }}>
          <div style={{ marginBottom: '4px' }}>
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
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-3)' }}>{item.option}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--color-gray-4)' }}>{item.price.toLocaleString()}원</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-gray-4)' }}>X {item.qty}</p>
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

        {/* 결제 정보 */}
        <SectionHeader title="결제 정보" />
        <div style={{ padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px' }}>원 금액</span>
            <span style={{ fontSize: '14px' }}>31,000원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px' }}>쿠폰 할인</span>
            <span style={{ fontSize: '14px', color: 'var(--color-gray-4)' }}>- 0원</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px' }}>마일리지 적용</span>
            <span style={{ fontSize: '14px', color: 'var(--color-gray-4)' }}>- 0원</span>
          </div>
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--color-gray-0)',
              borderRadius: '6px',
              textAlign: 'right',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '17px', fontWeight: 700 }}>총 31,000원</span>
          </div>

          <p style={labelStyle}>결제 번호</p>
          <p style={valueStyle}>000-0000-0000</p>
          <p style={labelStyle}>결제 방법</p>
          <p style={valueStyle}>EX) 부재중엔 경비실에 맡겨주세요.</p>
          <p style={labelStyle}>결제 수단</p>
          <p style={{ ...valueStyle, marginBottom: 0 }}>EX) 부재중엔 경비실에 맡겨주세요.</p>
        </div>
      </div>
    </div>
  );
}
