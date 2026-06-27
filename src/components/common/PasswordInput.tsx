import { useState } from 'react';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
};

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = '비밀번호를 입력하세요',
  error,
  maxLength,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={id}
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--color-gray-5)',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            width: '100%',
            padding: '12px 48px 12px 16px',
            fontSize: '15px',
            border: error ? '1px solid var(--color-point-main)' : '1px solid var(--color-gray-2)',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: 'var(--color-white)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = 'var(--color-gray-2)';
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-gray-4)',
          }}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '20px', height: '20px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.07 3.07L12 12m-3.81-3.81l3.29 3.29M12 12l3.29 3.29m0 0a9.97 9.97 0 011.93-1.93m-3.29-3.29l3.29 3.29M21 21l-3.29-3.29"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '20px', height: '20px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--color-point-main)',
            minHeight: '18px',
          }}
        >
          {error}
        </div>
      )}
      {!error && <div style={{ minHeight: '18px' }}></div>}
    </div>
  );
}
