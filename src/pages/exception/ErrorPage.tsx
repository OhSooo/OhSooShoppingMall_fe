import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

function ErrorLayout({ title, message, sub }: { title: string; message?: string; sub?: string }) {
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
          {title}
        </h2>
        {message && (
          <p
            style={{
              fontSize: '15px',
              color: 'var(--color-point-main)',
              margin: 0,
            }}
          >
            {message}
          </p>
        )}
        {sub && (
          <p
            style={{
              fontSize: '15px',
              color: 'var(--color-black)',
              fontWeight: 600,
              margin: '32px 0 0',
            }}
          >
            {sub}
          </p>
        )}
        <Link
          to="/"
          style={{
            marginTop: '16px',
            fontSize: '14px',
            color: 'var(--color-point-main)',
          }}
        >
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorLayout
        title="서비스 접근 실패되었습니다"
        message={`${error.status} ${error.statusText}`}
        sub="잠시 기다린 후, 다시 시도해주세요"
      />
    );
  }

  return (
    <ErrorLayout
      title="서비스 접근 실패되었습니다"
      message={error instanceof Error ? error.message : 'Error Message 내용'}
      sub="잠시 기다린 후, 다시 시도해주세요"
    />
  );
}
