import { Link } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function MyReviewPage() {
  return (
    <PageShell>
      <p>마이페이지 - 작성 리뷰 (로그인 필요)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/mypage/user">정보 관리로</Link>
        <Link to="/mypage/order">주문 내역으로</Link>
      </div>
    </PageShell>
  );
}
