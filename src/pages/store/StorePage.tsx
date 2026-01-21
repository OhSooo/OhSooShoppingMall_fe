import { Link, useParams } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function StorePage() {
  const { storeId } = useParams();

  return (
    <PageShell>
      <p>
        스토어 페이지 (storeId: <code>{storeId}</code>)
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/item/1">스토어에서 상품 클릭(1)</Link>
        <Link to="/list">목록으로 돌아가기</Link>
      </div>

      <p style={{ marginTop: 12 }}>플로우: 목록 → 스토어 클릭 → 스토어 페이지 → 상품 클릭</p>
    </PageShell>
  );
}
