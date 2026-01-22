import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setEmail,
  setVerificationCode,
  setCodeSent,
  setCodeVerified,
} from '../../../store/signupSlice';

type Props = {
  onNext: () => void;
};

export default function SignupPage_Email({ onNext }: Props) {
  const dispatch = useAppDispatch();
  const { email, verificationCode, isCodeSent, isCodeVerified } = useAppSelector(
    (state) => state.signup
  );

  const [errorMessage, setErrorMessage] = useState('');

  const handleSendCode = () => {
    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    // 간단한 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // TODO: 실제 API 호출
    dispatch(setCodeSent(true));
    setErrorMessage('');
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setErrorMessage('인증번호를 입력해주세요.');
      return;
    }

    // 간단한 검증 (실제로는 서버에서 확인)
    // 여기서는 6자리 숫자면 통과로 가정
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      dispatch(setCodeVerified(true));
      setErrorMessage('');
    } else {
      setErrorMessage('인증번호가 올바르지 않거나 만료되었습니다.');
    }
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
              setErrorMessage('');
            }}
            placeholder="example@email.com"
            disabled={isCodeSent}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '15px',
              border: '1px solid #CACACA',
              borderRadius: '6px',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: isCodeSent ? 'var(--color-gray-0)' : 'var(--color-white)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
            onBlur={(e) => (e.target.style.borderColor = '#CACACA')}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={isCodeSent}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              color: 'var(--color-white)',
              backgroundColor: isCodeSent ? '#9D9D9D' : 'var(--color-point-main)',
              border: 'none',
              borderRadius: '6px',
              cursor: isCodeSent ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isCodeSent) e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
            }}
            onMouseLeave={(e) => {
              if (!isCodeSent) e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
            }}
          >
            {isCodeSent ? '전송 완료' : '전송'}
          </button>
        </div>
        <div style={{ minHeight: '18px' }}></div>
      </div>

      {/* 인증번호 입력 */}
      {isCodeSent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                border: errorMessage
                  ? '1px solid var(--color-point-main)'
                  : '1px solid #CACACA',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'var(--color-white)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
              onBlur={(e) => {
                if (!errorMessage) e.target.style.borderColor = '#CACACA';
              }}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '500',
                color: 'var(--color-white)',
                backgroundColor: 'var(--color-point-main)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
              }}
            >
              확인
            </button>
          </div>
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
          {!errorMessage && <div style={{ minHeight: '18px' }}></div>}
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
