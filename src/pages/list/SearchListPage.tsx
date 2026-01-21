import { Link, useSearchParams } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function SearchListPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  return (
    <PageShell>
      <p>검색 결과 페이지</p>
      <p>
        query: <code>{q || '(empty)'}</code>
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/list">전체 목록으로</Link>
        <Link to="/store/1">스토어 클릭(1)</Link>
        <Link to="/item/1">상품 클릭(1)</Link>
      </div>

      <p style={{ marginTop: 12 }}>
        헤더 검색창에서 검색하면 여기로 이동: <code>/list/search?q=검색어</code>
      </p>
    </PageShell>
  );
}
