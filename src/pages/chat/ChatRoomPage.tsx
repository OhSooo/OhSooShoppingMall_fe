import { useParams } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function ChatRoomPage() {
  const { roomId } = useParams();

  return (
    <PageShell title="ChatRoomPage">
      <p>
        채팅방 페이지 (roomId: <code>{roomId}</code>) (로그인 필요)
      </p>

      <p>여기에 채팅 UI가 들어갈 예정</p>
    </PageShell>
  );
}
