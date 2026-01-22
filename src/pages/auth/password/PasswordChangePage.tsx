import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';
import SuccessModal from '../../../components/common/SuccessModal';

export default function PasswordChangePage() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // 비밀번호 보이기/숨기기 상태
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    if (!value) {
      setCurrentPasswordError('현재 비밀번호를 입력해주세요.');
    } else {
      setCurrentPasswordError('');
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (!value) {
      setNewPasswordError('새 비밀번호를 입력해주세요.');
    } else if (value.length < 8) {
      setNewPasswordError('비밀번호는 8자 이상 입력해주세요.');
    } else if (value.length > 72) {
      setNewPasswordError('비밀번호는 72자 이하로 입력해주세요.');
    } else {
      setNewPasswordError('');
    }

    // 새 비밀번호 확인과 일치하는지 확인
    if (newPasswordConfirm && value !== newPasswordConfirm) {
      setNewPasswordConfirmError('새 비밀번호와 일치하지 않습니다.');
    } else if (newPasswordConfirm && value === newPasswordConfirm) {
      setNewPasswordConfirmError('');
    }
  };

  const handleNewPasswordConfirmChange = (value: string) => {
    setNewPasswordConfirm(value);
    if (!value) {
      setNewPasswordConfirmError('새 비밀번호 확인을 입력해주세요.');
    } else if (value !== newPassword) {
      setNewPasswordConfirmError('새 비밀번호와 일치하지 않습니다.');
    } else {
      setNewPasswordConfirmError('');
    }
  };

  const isFormValid = () => {
    return (
      currentPassword &&
      newPassword &&
      newPasswordConfirm &&
      newPassword.length >= 8 &&
      newPassword.length <= 72 &&
      newPassword === newPasswordConfirm &&
      !currentPasswordError &&
      !newPasswordError &&
      !newPasswordConfirmError
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 검증
    const currentPasswordValidation = currentPassword.length > 0;
    const newPasswordValidation = newPassword.length >= 8 && newPassword.length <= 72;
    const newPasswordConfirmValidation = newPassword === newPasswordConfirm;

    if (!currentPasswordValidation) {
      setCurrentPasswordError('현재 비밀번호를 입력해주세요.');
    }
    if (!newPasswordValidation) {
      setNewPasswordError(
        newPassword.length < 8
          ? '비밀번호는 8자 이상 입력해주세요.'
          : '비밀번호는 72자 이하로 입력해주세요.'
      );
    }
    if (!newPasswordConfirmValidation) {
      setNewPasswordConfirmError('새 비밀번호와 일치하지 않습니다.');
    }

    if (currentPasswordValidation && newPasswordValidation && newPasswordConfirmValidation) {
      setIsLoading(true);
      setSubmitError('');

      try {
        // TODO: API 호출하여 비밀번호 변경
        // await changePassword({ currentPassword, newPassword, newPasswordConfirm });
        
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/mypage');
        }, 2300); // 모달이 사라진 후 이동
      } catch (error: any) {
        setSubmitError(error?.message || '비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <PageShell>
      {showSuccessModal && (
        <SuccessModal
          message="비밀번호가 성공적으로 변경되었습니다."
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/mypage"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-gray-4)',
              textDecoration: 'none',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '24px', height: '24px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--color-black)',
              margin: 0,
            }}
          >
            비밀번호 변경
          </h1>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 현재 비밀번호 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="currentPassword"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              현재 비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => handleCurrentPasswordChange(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  fontSize: '15px',
                  border: currentPasswordError
                    ? '1px solid var(--color-point-main)'
                    : '1px solid var(--color-gray-2)',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'var(--color-white)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
                onBlur={(e) => {
                  if (!currentPasswordError) e.target.style.borderColor = 'var(--color-gray-2)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                {showCurrentPassword ? (
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
            {currentPasswordError && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  minHeight: '18px',
                }}
              >
                {currentPasswordError}
              </div>
            )}
            {!currentPasswordError && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 새 비밀번호 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="newPassword"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              새 비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                placeholder="새 비밀번호를 입력하세요 (8자 이상 72자 이하)"
                maxLength={72}
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  fontSize: '15px',
                  border: newPasswordError
                    ? '1px solid var(--color-point-main)'
                    : '1px solid var(--color-gray-2)',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'var(--color-white)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
                onBlur={(e) => {
                  if (!newPasswordError) e.target.style.borderColor = 'var(--color-gray-2)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
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
                {showNewPassword ? (
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
            {newPasswordError && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  minHeight: '18px',
                }}
              >
                {newPasswordError}
              </div>
            )}
            {!newPasswordError && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 새 비밀번호 확인 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="newPasswordConfirm"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              새 비밀번호 확인
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="newPasswordConfirm"
                type={showNewPasswordConfirm ? 'text' : 'password'}
                value={newPasswordConfirm}
                onChange={(e) => handleNewPasswordConfirmChange(e.target.value)}
                placeholder="새 비밀번호를 다시 입력하세요"
                maxLength={72}
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  fontSize: '15px',
                  border: newPasswordConfirmError
                    ? '1px solid var(--color-point-main)'
                    : '1px solid var(--color-gray-2)',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'var(--color-white)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
                onBlur={(e) => {
                  if (!newPasswordConfirmError) e.target.style.borderColor = 'var(--color-gray-2)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
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
                {showNewPasswordConfirm ? (
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
            {newPasswordConfirmError && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  minHeight: '18px',
                }}
              >
                {newPasswordConfirmError}
              </div>
            )}
            {!newPasswordConfirmError && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 에러 메시지 */}
          {submitError && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--color-point-back)',
                border: '1px solid var(--color-point-main)',
                borderRadius: '6px',
                color: 'var(--color-point-main)',
                fontSize: '14px',
              }}
            >
              {submitError}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-white)',
              backgroundColor:
                isLoading || !isFormValid()
                  ? 'var(--color-gray-3)'
                  : 'var(--color-point-main)',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading || !isFormValid() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && isFormValid()) {
                e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && isFormValid()) {
                e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
              }
            }}
          >
            {isLoading ? '변경 중...' : '변경'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
