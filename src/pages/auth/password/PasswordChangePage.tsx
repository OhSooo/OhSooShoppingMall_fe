import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';
import SuccessModal from '../../../components/common/SuccessModal';
import PasswordInput from '../../../components/common/PasswordInput';

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
          <PasswordInput
            id="currentPassword"
            label="현재 비밀번호"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            placeholder="현재 비밀번호를 입력하세요"
            error={currentPasswordError}
          />

          {/* 새 비밀번호 입력 */}
          <PasswordInput
            id="newPassword"
            label="새 비밀번호"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="새 비밀번호를 입력하세요 (8자 이상 72자 이하)"
            error={newPasswordError}
            maxLength={72}
          />

          {/* 새 비밀번호 확인 입력 */}
          <PasswordInput
            id="newPasswordConfirm"
            label="새 비밀번호 확인"
            value={newPasswordConfirm}
            onChange={handleNewPasswordConfirmChange}
            placeholder="새 비밀번호를 다시 입력하세요"
            error={newPasswordConfirmError}
            maxLength={72}
          />

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
