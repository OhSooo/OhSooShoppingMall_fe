import { Link } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function HomePage() {
  return (
    <PageShell title="HomePage">
      <p>홈 페이지</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/list">전체 목록으로</Link>
        <Link to="/list/search?q=shoes">검색( shoes )</Link>
        <Link to="/store/1">스토어(1)로</Link>
        <Link to="/item/1">상품(1)로</Link>
      </div>

      <p style={{ marginTop: 12 }}>
        플로우 이미지 기준: 홈 → 검색/카테고리 → 목록 → 스토어/상품 상세
      </p>
    </PageShell>
  );
}
