import { useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function CartPage() {
  const navigate = useNavigate();

  return (
    <PageShell title="CartPage">
      <p>장바구니 페이지 (로그인 필요)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => navigate('/order')}>
          주문하기 (Order로)
        </button>
        <button type="button" onClick={() => navigate('/item/1')}>
          상품으로 돌아가기 (Item 1)
        </button>
      </div>

      <p style={{ marginTop: 12 }}>플로우: 장바구니 → 주문하기 → 주문 페이지</p>
    </PageShell>
  );
}
