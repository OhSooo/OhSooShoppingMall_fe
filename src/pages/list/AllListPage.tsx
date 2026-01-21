import { Link } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function AllListPage() {
  return (
    <PageShell>
      <p>전체 목록 페이지</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/list/search?q=demo">검색 페이지로(쿼리 demo)</Link>
        <Link to="/store/1">스토어 클릭(1)</Link>
        <Link to="/item/1">상품 클릭(1)</Link>
      </div>

      <p style={{ marginTop: 12 }}>플로우: 홈 → (검색/카테고리) → 목록 → (스토어/상품)</p>
    </PageShell>
  );
}
