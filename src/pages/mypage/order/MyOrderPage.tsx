import { Link } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function MyOrderPage() {
  return (
    <PageShell title="MyOrderPage">
      <p>마이페이지 - 주문 내역 (로그인 필요)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/mypage/user">정보 관리로</Link>
        <Link to="/mypage/review">작성 리뷰로</Link>
      </div>
    </PageShell>
  );
}
