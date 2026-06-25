import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import paymentFailImg from '../../../assets/payment-fail.png';

export default function PaymentFailPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 48px 48px' }}>
      <div className="page-card" style={{ padding: '52px 40px 48px', textAlign: 'center', maxWidth: '560px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 8px' }}>
          결제 실패되었습니다
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--color-point-main)', margin: '0 0 32px' }}>
          Error Message 내용
        </p>

        <div style={{ margin: '0 auto 36px' }}>
          <img
            src={paymentFailImg}
            alt="결제 실패"
            style={{ width: '180px', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
          <Button variant="primary" fullWidth onClick={() => navigate('/order')}>
            주문 다시 하러 가기
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/chat')}>
            문의 하기
          </Button>
        </div>
      </div>
    </div>
  );
}
