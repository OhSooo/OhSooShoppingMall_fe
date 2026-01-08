import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type Props = {
  title: string;
  children?: ReactNode;
};

export default function PageShell({ title, children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  return (
    <div style={{ padding: 24 }}>
      <h1>{title}</h1>

      <div style={{ margin: '12px 0' }}>
        <div>
          <strong>Path:</strong> <code>{location.pathname}</code>
        </div>
        <div>
          <strong>Token:</strong> <code>{token ? 'EXISTS' : 'NONE'}</code>
        </div>
        <div>
          <strong>Role:</strong> <code>{role || 'NONE'}</code>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
        <Link to="/">Home</Link>
        <Link to="/list">List</Link>
        <Link to="/list/search?q=test">Search(test)</Link>
        <Link to="/store/1">Store(1)</Link>
        <Link to="/item/1">Item(1)</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/mypage/user">MyPage</Link>
        <Link to="/chat">Chat</Link>
      </div>

      <hr />

      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}
