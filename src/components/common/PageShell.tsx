import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export default function PageShell({ children }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 48px 48px',
        minHeight: '500px',
      }}
    >
      <div className="page-card" style={{ padding: '48px 40px' }}>
        {children}
      </div>
    </div>
  );
}
