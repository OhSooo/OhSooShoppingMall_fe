import { useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <PageShell title="PaymentSuccessPage">
      <p>결제 성공 페이지 (로그인 필요)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => navigate('/mypage/order')}>
          내 주문내역으로
        </button>
        <button type="button" onClick={() => navigate('/')}>
          홈으로
        </button>
      </div>
    </PageShell>
  );
}
