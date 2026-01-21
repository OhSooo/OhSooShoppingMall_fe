import { useNavigate, useParams } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function ItemPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  return (
    <PageShell>
      <p>
        상품 상세 페이지 (itemId: <code>{itemId}</code>)
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {/* 이벤트들: 장바구니 담기 / 주문하기 / 문의하기 */}
        <button type="button" onClick={() => navigate('/cart')}>
          장바구니 담기 (Cart로)
        </button>

        <button type="button" onClick={() => navigate('/order')}>
          주문하기 (Order로)
        </button>

        <button type="button" onClick={() => navigate('/chat/1')}>
          문의하기 (ChatRoom 1로)
        </button>

        <button type="button" onClick={() => navigate(`/store/1`)}>
          스토어로
        </button>
      </div>

      <p style={{ marginTop: 12 }}>
        플로우: 상품 → (장바구니 담기) → 장바구니 / (주문하기) → 주문 / (문의하기) → 채팅방
      </p>
    </PageShell>
  );
}
