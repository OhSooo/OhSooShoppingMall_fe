import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setEmail,
  setVerificationCode,
  setCodeSent,
  setCodeVerified,
} from '../../../store/signupSlice';
import { sendVerificationCode, verifyCode } from '../../../services/auth/signupService';
import { ApiError } from '../../../api/config';
import { validateEmail, validateVerificationCode } from '../../../utils/validation';

type Props = {
  onNext: () => void;
};

export default function SignupPage_Email({ onNext }: Props) {
  const dispatch = useAppDispatch();
  const { email, verificationCode, isCodeSent, isCodeVerified } = useAppSelector(
    (state) => state.signup
  );

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailSuccessMessage, setEmailSuccessMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 효과
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // 타이머 만료 시 인증 상태 초기화
      dispatch(setCodeVerified(false));
      setErrorMessage('인증번호 유효 시간이 만료되었습니다. 다시 전송해주세요.');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, dispatch]);

  const handleSendCode = async () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailErrorMessage(emailValidation.message);
      setEmailSuccessMessage('');
      return;
    }

    setIsLoading(true);
    setEmailErrorMessage('');
    setEmailSuccessMessage('');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await sendVerificationCode(email);
      dispatch(setCodeSent(true));
      setEmailSuccessMessage('인증번호가 전송되었습니다.');
      // 타이머 시작
      setTimeLeft(result.expiresInSeconds);
      // 인증 상태 초기화 (재전송 시)
      dispatch(setCodeVerified(false));
      dispatch(setVerificationCode(''));
    } catch (error) {
      if (error instanceof ApiError) {
        setEmailErrorMessage(error.message || '인증번호 발송에 실패했습니다.');
      } else {
        setEmailErrorMessage('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    // 타이머 만료 체크
    if (timeLeft === 0) {
      setErrorMessage('인증번호 유효 시간이 만료되었습니다. 다시 전송해주세요.');
      return;
    }

    const codeValidation = validateVerificationCode(verificationCode);
    if (!codeValidation.isValid) {
      setErrorMessage(codeValidation.message);
      setSuccessMessage('');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await verifyCode(email, verificationCode);
      if (result.verified) {
        dispatch(setCodeVerified(true));
        setSuccessMessage('인증번호가 확인되었습니다.');
        setErrorMessage('');
        // 타이머 정지
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setTimeLeft(null);
      } else {
        setErrorMessage('인증번호가 올바르지 않습니다.');
        setSuccessMessage('');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message || '인증번호 확인에 실패했습니다.');
      } else {
        setErrorMessage('인증번호 확인에 실패했습니다. 다시 시도해주세요.');
      }
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (isCodeVerified) {
      onNext();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* 이메일 입력 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="email"
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-gray-5)',
          }}
        >
          이메일
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              dispatch(setEmail(e.target.value));
              setEmailErrorMessage('');
              setEmailSuccessMessage('');
              // 이메일 변경 시 인증 상태 초기화
              if (isCodeSent) {
                dispatch(setCodeSent(false));
                dispatch(setCodeVerified(false));
                dispatch(setVerificationCode(''));
                setTimeLeft(null);
                setErrorMessage('');
                setSuccessMessage('');
              }
            }}
            placeholder="이메일을 입력하세요 (예: example@email.com)"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '15px',
              border: emailErrorMessage
                ? '1px solid var(--color-point-main)'
                : '1px solid #CACACA',
              borderRadius: '6px',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: 'var(--color-white)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
            onBlur={(e) => {
              if (!emailErrorMessage) e.target.style.borderColor = '#CACACA';
            }}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              color: 'var(--color-white)',
              backgroundColor: isLoading ? '#9D9D9D' : 'var(--color-point-main)',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
            }}
          >
            {isLoading ? '전송 중...' : isCodeSent ? '재전송' : '전송'}
          </button>
        </div>
        {emailSuccessMessage && (
          <div
            style={{
              fontSize: '13px',
              color: '#28a745',
              minHeight: '18px',
            }}
          >
            {emailSuccessMessage}
          </div>
        )}
        {emailErrorMessage && (
          <div
            style={{
              fontSize: '13px',
              color: 'var(--color-point-main)',
              minHeight: '18px',
            }}
          >
            {emailErrorMessage}
          </div>
        )}
        {!emailSuccessMessage && !emailErrorMessage && (
          <div style={{ minHeight: '18px' }}></div>
        )}
      </div>

      {/* 인증번호 입력 */}
      {isCodeSent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label
              htmlFor="verificationCode"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              인증번호
            </label>
            {timeLeft !== null && timeLeft > 0 && (
              <span
                style={{
                  fontSize: '13px',
                  color: timeLeft <= 60 ? 'var(--color-point-main)' : '#666',
                  fontWeight: '500',
                }}
              >
                {formatTime(timeLeft)}
              </span>
            )}
            {timeLeft === 0 && (
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  fontWeight: '500',
                }}
              >
                만료됨
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => {
                dispatch(setVerificationCode(e.target.value));
                setErrorMessage('');
                dispatch(setCodeVerified(false));
              }}
              placeholder="인증번호 6자리 입력"
              maxLength={6}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '15px',
                border:
                  errorMessage || timeLeft === 0
                    ? '1px solid var(--color-point-main)'
                    : successMessage
                    ? '1px solid #28a745'
                    : '1px solid #CACACA',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'var(--color-white)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
              onBlur={(e) => {
                if (!errorMessage && !successMessage && timeLeft !== 0) {
                  e.target.style.borderColor = '#CACACA';
                }
              }}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isLoading || timeLeft === 0}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '500',
                color: 'var(--color-white)',
                backgroundColor: isLoading || timeLeft === 0 ? '#9D9D9D' : 'var(--color-point-main)',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading || timeLeft === 0 ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && timeLeft !== 0) {
                  e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && timeLeft !== 0) {
                  e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
                }
              }}
            >
              {isLoading ? '확인 중...' : timeLeft === 0 ? '만료됨' : '확인'}
            </button>
          </div>
          {successMessage && (
            <div
              style={{
                fontSize: '13px',
                color: '#28a745',
                minHeight: '18px',
              }}
            >
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div
              style={{
                fontSize: '13px',
                color: 'var(--color-point-main)',
                minHeight: '18px',
              }}
            >
              {errorMessage}
            </div>
          )}
          {!successMessage && !errorMessage && (
            <div style={{ minHeight: '18px' }}></div>
          )}
        </div>
      )}

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!isCodeVerified}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--color-white)',
          backgroundColor: isCodeVerified ? 'var(--color-point-main)' : '#9D9D9D',
          border: 'none',
          borderRadius: '6px',
          cursor: isCodeVerified ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s',
          marginTop: '8px',
        }}
        onMouseEnter={(e) => {
          if (isCodeVerified) e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
        }}
        onMouseLeave={(e) => {
          if (isCodeVerified) e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
        }}
      >
        다음
      </button>
    </div>
  );
}
