import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setPassword, setPasswordConfirm } from '../../../store/signupSlice';
import { validatePassword, validatePasswordConfirm } from '../../../utils/validation';
import PasswordInput from '../../../components/input/PasswordInput';

type Props = {
  onNext: () => void;
  onPrev: () => void;
};

export default function SignupPage_Password({ onNext, onPrev }: Props) {
  const dispatch = useAppDispatch();
  const { password, passwordConfirm } = useAppSelector((state) => state.signup);

  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const handlePasswordChange = (value: string) => {
    dispatch(setPassword(value));
    const validation = validatePassword(value);
    setPasswordError(validation.message);
  };

  const handlePasswordConfirmChange = (value: string) => {
    dispatch(setPasswordConfirm(value));
    const validation = validatePasswordConfirm(password, value);
    setPasswordConfirmError(validation.message);
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
      <PasswordInput
        id="password"
        label="비밀번호"
        value={password}
        onChange={handlePasswordChange}
        placeholder="비밀번호를 입력하세요 (8자 이상, 영문과 숫자 포함)"
        error={passwordError}
      />

      {/* 비밀번호 확인 입력 */}
      <PasswordInput
        id="passwordConfirm"
        label="비밀번호 확인"
        value={passwordConfirm}
        onChange={handlePasswordConfirmChange}
        placeholder="비밀번호를 한 번 더 입력하세요"
        error={passwordConfirmError}
      />

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
            color: 'var(--color-gray-4)',
            backgroundColor: 'var(--color-gray-0)',
            border: '1px solid var(--color-gray-2)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gray-1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gray-0)';
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
            color: 'var(--color-white)',
            backgroundColor: isFormValid() ? 'var(--color-point-main)' : 'var(--color-gray-3)',
            border: 'none',
            borderRadius: '6px',
            cursor: isFormValid() ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (isFormValid()) e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
          }}
          onMouseLeave={(e) => {
            if (isFormValid()) e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
