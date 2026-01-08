import { useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function PaymentPage() {
  const navigate = useNavigate();

  return (
    <PageShell title="PaymentPage">
      <p>결제 페이지 (로그인 필요)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => navigate('/payment/success')}>
          결제 성공 (Success로)
        </button>
        <button type="button" onClick={() => navigate('/payment/fail')}>
          결제 실패 (Fail로)
        </button>
        <button type="button" onClick={() => navigate('/order')}>
          주문으로 돌아가기
        </button>
      </div>

      <p style={{ marginTop: 12 }}>여기서는 PG사 연동 후 결과에 따라 success/fail로 보내는 흐름</p>
    </PageShell>
  );
}
