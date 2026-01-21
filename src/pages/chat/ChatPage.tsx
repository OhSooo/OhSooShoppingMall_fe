import { Link } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function ChatPage() {
  return (
    <PageShell>
      <p>채팅방 목록 페이지 (로그인 필요)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/chat/1">채팅방 1</Link>
        <Link to="/chat/2">채팅방 2</Link>
      </div>

      <p style={{ marginTop: 12 }}>플로우: 상품 페이지에서 문의하기 → 채팅방으로 이동</p>
    </PageShell>
  );
}
