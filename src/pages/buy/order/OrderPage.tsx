import { useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function OrderPage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <p>주문 페이지 (로그인 필요)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => navigate('/payment')}>
          결제하기 (Payment로)
        </button>
        <button type="button" onClick={() => navigate('/cart')}>
          장바구니로 돌아가기
        </button>
      </div>

      <p style={{ marginTop: 12 }}>플로우: 주문 → 결제(PG사 연동) → 결제 성공/실패</p>
    </PageShell>
  );
}
