import { useEffect, useState } from 'react';

type Props = {
  message: string;
  onClose: () => void;
  duration?: number; // 표시 시간 (ms)
};

export default function SuccessModal({ message, onClose, duration = 2000 }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // duration 후에 페이드아웃 시작
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // 페이드아웃 애니메이션 후 컴포넌트 언마운트
    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, duration + 300); // 페이드아웃 애니메이션 시간(300ms) 추가

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none', // 클릭 이벤트 무시
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          border: '2px solid var(--color-point-main)',
          borderRadius: '8px',
          padding: '24px 32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          maxWidth: '400px',
          textAlign: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '24px', height: '24px', color: 'var(--color-point-main)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-black)',
              margin: 0,
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
