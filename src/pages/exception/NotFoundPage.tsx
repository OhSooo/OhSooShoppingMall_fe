import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 48px 48px',
        minHeight: '500px',
        backgroundColor: 'var(--color-point-back)',
      }}
    >
      <div
        className="page-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 40px',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--color-black)',
            margin: 0,
          }}
        >
          페이지를 찾을 수 없습니다
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-point-main)',
            margin: 0,
          }}
        >
          존재하지 않는 경로입니다
        </p>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-black)',
            fontWeight: 600,
            margin: '32px 0 0',
          }}
        >
          잠시 기다린 후, 다시 시도해주세요
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <Link to="/" style={{ fontSize: '14px', color: 'var(--color-point-main)' }}>
            홈으로
          </Link>
          <Link to="/list" style={{ fontSize: '14px', color: 'var(--color-point-main)' }}>
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
