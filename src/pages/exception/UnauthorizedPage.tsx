import { Link, useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

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
          접근 권한이 없습니다
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-point-main)',
            margin: 0,
          }}
        >
          로그인이 필요하거나 접근이 제한된 페이지입니다
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: 'var(--color-white)',
              color: 'var(--color-point-main)',
              border: '1.5px solid var(--color-point-main)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            이전으로
          </button>
          <Link
            to="/login"
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: 'var(--color-point-main)',
              color: '#FFFFFF',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
