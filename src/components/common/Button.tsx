import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
};

export default function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  style,
  disabled,
  ...rest
}: Props) {
  const base: React.CSSProperties = {
    width: fullWidth ? '100%' : undefined,
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.15s, opacity 0.15s',
    border: 'none',
    lineHeight: 1,
    opacity: disabled ? 0.5 : 1,
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-point-main)',
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'var(--color-white)',
      color: 'var(--color-point-main)',
      border: '1.5px solid var(--color-point-main)',
    },
  };

  return (
    <button
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor =
            variant === 'primary' ? 'var(--color-point-main-hover)' : 'var(--color-point-sub)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor =
            variant === 'primary' ? 'var(--color-point-main)' : 'var(--color-white)';
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
