import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';

export default function PaymentFailPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 48px 48px' }}>
      <div className="page-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 8px' }}>
          결제 실패되었습니다
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--color-point-main)', margin: '0 0 36px' }}>
          Error Message 내용
        </p>

        {/* 에러 아이콘 */}
        <div style={{ margin: '0 auto 40px', width: '120px', height: '120px' }}>
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
            <defs>
              <radialGradient id="failGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="100%" stopColor="#2563EB" />
              </radialGradient>
            </defs>
            <circle cx="60" cy="60" r="55" fill="url(#failGrad)" stroke="#BFDBFE" strokeWidth="2" />
            <circle cx="60" cy="60" r="44" fill="none" stroke="#BFDBFE" strokeWidth="1.5" opacity="0.6" />
            <text x="60" y="75" textAnchor="middle" fontSize="44" fontWeight="700" fill="white">!</text>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
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
