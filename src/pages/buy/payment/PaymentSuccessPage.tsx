import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 48px 48px' }}>
      <div className="page-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 8px' }}>
          주문 완료되었습니다
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--color-point-main)', margin: '0 0 36px' }}>
          상품을 준비중입니다
        </p>

        {/* 일러스트 영역 */}
        <div
          style={{
            width: '200px',
            height: '200px',
            margin: '0 auto 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="160" height="160">
            <circle cx="100" cy="100" r="90" fill="#EEF4FF" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="60" fill="#DBEAFE" />
            <path d="M72 100 L90 118 L130 82" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto 32px' }}>
          <Button variant="primary" fullWidth onClick={() => navigate('/mypage/order')}>
            주문 확인하러 가기
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
            쇼핑 계속하기
          </Button>
        </div>

        {/* 주문 요약 영역 placeholder */}
        <div
          style={{
            maxWidth: '400px',
            margin: '0 auto',
            height: '100px',
            backgroundColor: 'var(--color-gray-0)',
            borderRadius: '8px',
            border: '1px solid var(--color-gray-1)',
          }}
        />
      </div>
    </div>
  );
}
