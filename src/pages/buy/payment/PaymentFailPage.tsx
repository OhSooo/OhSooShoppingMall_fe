import { useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function PaymentFailPage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <p>결제 실패 페이지 (로그인 필요)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => navigate('/payment')}>
          결제 다시 시도
        </button>
        <button type="button" onClick={() => navigate('/order')}>
          주문으로 돌아가기
        </button>
      </div>
    </PageShell>
  );
}
