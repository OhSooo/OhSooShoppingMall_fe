import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setPassword, setPasswordConfirm } from '../../../store/signupSlice';

type Props = {
  onNext: () => void;
  onPrev: () => void;
};

export default function SignupPage_Password({ onNext, onPrev }: Props) {
  const dispatch = useAppDispatch();
  const { password, passwordConfirm } = useAppSelector((state) => state.signup);

  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const validatePassword = (pwd: string): string => {
    if (!pwd) {
      return '비밀번호를 입력해주세요.';
    }
    if (pwd.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(pwd)) {
      return '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }
    return '';
  };

  const handlePasswordChange = (value: string) => {
    dispatch(setPassword(value));
    const error = validatePassword(value);
    setPasswordError(error);
  };

  const handlePasswordConfirmChange = (value: string) => {
    dispatch(setPasswordConfirm(value));
    if (value && value !== password) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordConfirmError('');
    }
  };

  const isFormValid = () => {
    return (
      password &&
      passwordConfirm &&
      !passwordError &&
      !passwordConfirmError &&
      password === passwordConfirm
    );
  };

  const handleNext = () => {
    if (isFormValid()) {
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
      {/* 비밀번호 입력 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="password"
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#444444',
          }}
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder="비밀번호를 입력하세요 (8자 이상, 영문+숫자)"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            border: passwordError ? '1px solid #BF4134' : '1px solid #CACACA',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: '#FDFDFD',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#BF4134')}
          onBlur={(e) => {
            if (!passwordError) e.target.style.borderColor = '#CACACA';
          }}
        />
        {passwordError && (
          <div
            style={{
              fontSize: '13px',
              color: '#BF4134',
              minHeight: '18px',
            }}
          >
            {passwordError}
          </div>
        )}
        {!passwordError && <div style={{ minHeight: '18px' }}></div>}
      </div>

      {/* 비밀번호 확인 입력 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="passwordConfirm"
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#444444',
          }}
        >
          비밀번호 확인
        </label>
        <input
          id="passwordConfirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) => handlePasswordConfirmChange(e.target.value)}
          placeholder="비밀번호를 다시 입력하세요"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            border: passwordConfirmError
              ? '1px solid #BF4134'
              : '1px solid #CACACA',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: '#FDFDFD',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#BF4134')}
          onBlur={(e) => {
            if (!passwordConfirmError) e.target.style.borderColor = '#CACACA';
          }}
        />
        {passwordConfirmError && (
          <div
            style={{
              fontSize: '13px',
              color: '#BF4134',
              minHeight: '18px',
            }}
          >
            {passwordConfirmError}
          </div>
        )}
        {!passwordConfirmError && <div style={{ minHeight: '18px' }}></div>}
      </div>

      {/* 버튼들 */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '8px',
        }}
      >
        <button
          type="button"
          onClick={onPrev}
          style={{
            flex: 1,
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#626262',
            backgroundColor: '#F5F5F5',
            border: '1px solid #CACACA',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#EBEBEB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F5F5';
          }}
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isFormValid()}
          style={{
            flex: 1,
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#FDFDFD',
            backgroundColor: isFormValid() ? '#BF4134' : '#9D9D9D',
            border: 'none',
            borderRadius: '6px',
            cursor: isFormValid() ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (isFormValid()) e.currentTarget.style.backgroundColor = '#a63a2e';
          }}
          onMouseLeave={(e) => {
            if (isFormValid()) e.currentTarget.style.backgroundColor = '#BF4134';
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
