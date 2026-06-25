import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import paymentSuccessImg from '../../../assets/payment-success.png';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 48px 48px' }}>
      <div className="page-card" style={{ padding: '52px 40px 48px', textAlign: 'center', maxWidth: '560px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 8px' }}>
          주문 완료되었습니다
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--color-point-main)', margin: '0 0 32px' }}>
          상품을 준비중입니다
        </p>

        <div style={{ margin: '0 auto 36px' }}>
          <img
            src={paymentSuccessImg}
            alt="결제 완료"
            style={{ width: '260px', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
          <Button variant="primary" fullWidth onClick={() => navigate('/mypage/order')}>
            주문 확인하러 가기
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    </div>
  );
}
