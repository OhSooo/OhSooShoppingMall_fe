import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

type Props = {
  title: string;
  backTo?: string;
  action?: ReactNode;
};

export default function PageTitle({ title, backTo, action }: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px 16px',
      }}
    >
      <button
        onClick={handleBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--color-black)',
          padding: 0,
        }}
      >
        <span style={{ fontSize: '20px', lineHeight: 1 }}>‹</span>
        {title}
      </button>
      {action && <div>{action}</div>}
    </div>
  );
}
