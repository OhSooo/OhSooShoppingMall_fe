import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  children?: ReactNode;
};

export default function PageShell({ children }: Props) {
  const location = useLocation();

  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  return (
    <>
      {/* 본문 컨테이너 - 중앙 정렬 + 빨간 테두리 + 흰 배경 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '40px 48px',
          // 고정 최소 높이 - 브라우저가 작아지면 스크롤 발생
          minHeight: '500px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1000px',
            backgroundColor: 'var(--color-white)',
            border: '3px solid var(--color-point-main)',
            borderRadius: '3px',
            padding: '48px 40px',
            // 컨텐츠에 맞게 자연스럽게 늘어남
            height: 'fit-content',
            minHeight: '400px',
          }}
        >
          {children}
        </div>
      </div>

      {/* 우측 하단 Debug HUD (fixed) */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 99999,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ marginBottom: '4px' }}>
          <span style={{ color: 'var(--color-gray-3)' }}>Page:</span>{' '}
          <code style={{ color: 'var(--color-point-sub)' }}>{location.pathname}</code>
        </div>
        <div style={{ marginBottom: '4px' }}>
          <span style={{ color: 'var(--color-gray-3)' }}>Token:</span>{' '}
          <code style={{ color: token ? '#4ade80' : '#f87171' }}>
            {token ? 'EXISTS' : 'NONE'}
          </code>
        </div>
        <div>
          <span style={{ color: 'var(--color-gray-3)' }}>Role:</span>{' '}
          <code style={{ color: 'var(--color-point-sub)' }}>{role || 'NONE'}</code>
        </div>
      </div>
    </>
  );
}
