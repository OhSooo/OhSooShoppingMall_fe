import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <PageShell>
        <p>
          status: <code>{error.status}</code>
        </p>
        <p>
          statusText: <code>{error.statusText}</code>
        </p>
        <p>
          data: <code>{String(error.data || '')}</code>
        </p>
        <Link to="/">홈으로</Link>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <p>
        message: <code>{error instanceof Error ? error.message : String(error)}</code>
      </p>
      <Link to="/">홈으로</Link>
    </PageShell>
  );
}
