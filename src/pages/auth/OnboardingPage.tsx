import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';
import { updateMe } from '../../api/users/userApi';
import SuccessModal from '../../components/modal/SuccessModal';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export default function OnboardingPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [nameError, setNameError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.length > 0 && value.length < 2) {
      setNameError('이름은 2자 이상 입력해주세요.');
    } else if (value.length > 255) {
      setNameError('이름은 255자 이하로 입력해주세요.');
    } else {
      setNameError('');
    }
  };

  const handleBirthChange = (value: string) => {
    setBirth(value);
    if (value && new Date(value) > new Date()) {
      setBirthError('생년월일은 오늘 이전이어야 합니다.');
    } else {
      setBirthError('');
    }
  };

  const handlePhoneChange = (value: string) => {
    // 숫자만 입력받기
    const numbersOnly = value.replace(/\D/g, '');
    setPhone(numbersOnly);
    if (numbersOnly && numbersOnly.length < 10) {
      setPhoneError('전화번호는 10자 이상 입력해주세요.');
    } else if (numbersOnly.length > 50) {
      setPhoneError('전화번호는 50자 이하로 입력해주세요.');
    } else {
      setPhoneError('');
    }
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 255) {
      setAddressError('주소는 255자 이하로 입력해주세요.');
    } else {
      setAddressError('');
    }
  };

  const isFormValid = () => {
    return (
      name &&
      birth &&
      gender &&
      phone &&
      address &&
      !nameError &&
      !birthError &&
      !phoneError &&
      !addressError
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 검증
    const nameValidation = name.length >= 2 && name.length <= 255;
    const birthValidation = birth && new Date(birth) <= new Date();
    const phoneValidation = phone.length >= 10 && phone.length <= 50;
    const addressValidation = address.length > 0 && address.length <= 255;
    const genderValidation = !!gender;

    if (!nameValidation) {
      setNameError(name.length < 2 ? '이름은 2자 이상 입력해주세요.' : '이름은 255자 이하로 입력해주세요.');
    }
    if (!birthValidation) {
      setBirthError('올바른 생년월일을 입력해주세요.');
    }
    if (!genderValidation) {
      setGenderError('성별을 선택해주세요.');
    }
    if (!phoneValidation) {
      setPhoneError('전화번호는 10자 이상 50자 이하로 입력해주세요.');
    }
    if (!addressValidation) {
      setAddressError('주소를 입력해주세요.');
    }

    if (nameValidation && birthValidation && phoneValidation && addressValidation && genderValidation) {
      setIsLoading(true);
      setSubmitError('');

      try {
        await updateMe({
          name,
          birth,
          gender: gender as Gender,
          phone,
          address,
        });
        
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2300); // 모달이 사라진 후 이동
      } catch (error: any) {
        setSubmitError(error?.message || '정보 입력에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <PageShell>
      {showSuccessModal && (
        <SuccessModal
          message="정보가 성공적으로 입력되었습니다."
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
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--color-black)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            추가 정보 입력
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--color-gray-4)',
              marginTop: '12px',
              textAlign: 'center',
            }}
          >
            서비스 이용을 위해 추가 정보를 입력해주세요.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 이름 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="name"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              이름 <span style={{ color: 'var(--color-point-main)' }}>*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="이름을 입력하세요 (2자 이상)"
              maxLength={255}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: nameError ? '1px solid var(--color-point-main)' : '1px solid var(--color-gray-2)',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'var(--color-white)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
              onBlur={(e) => {
                if (!nameError) e.target.style.borderColor = 'var(--color-gray-2)';
              }}
            />
            {nameError && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  minHeight: '18px',
                }}
              >
                {nameError}
              </div>
            )}
            {!nameError && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 생년월일 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="birth"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              생년월일 <span style={{ color: 'var(--color-point-main)' }}>*</span>
            </label>
            <input
              id="birth"
              type="date"
              value={birth}
              onChange={(e) => handleBirthChange(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: birthError ? '1px solid var(--color-point-main)' : '1px solid var(--color-gray-2)',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'var(--color-white)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
              onBlur={(e) => {
                if (!birthError) e.target.style.borderColor = 'var(--color-gray-2)';
              }}
            />
            {birthError && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  minHeight: '18px',
                }}
              >
                {birthError}
              </div>
            )}
            {!birthError && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 성별 선택 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              성별 <span style={{ color: 'var(--color-point-main)' }}>*</span>
            </label>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                padding: '12px 0',
              }}
            >
              {(['MALE', 'FEMALE', 'OTHER'] as Gender[]).map((g) => (
                <label
                  key={g}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    color: 'var(--color-gray-5)',
                  }}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => {
                      setGender(e.target.value as Gender);
                      setGenderError('');
                    }}
                    required
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: 'var(--color-point-main)',
                    }}
                  />
                  <span>
                    {g === 'MALE' && '남성'}
                    {g === 'FEMALE' && '여성'}
                    {g === 'OTHER' && '기타'}
                  </span>
                </label>
              ))}
            </div>
            {genderError && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  minHeight: '18px',
                }}
              >
                {genderError}
              </div>
            )}
            {!genderError && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 전화번호 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="phone"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              전화번호 <span style={{ color: 'var(--color-point-main)' }}>*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="전화번호를 입력하세요 (숫자만, 예: 01012345678)"
              maxLength={50}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: phoneError ? '1px solid var(--color-point-main)' : '1px solid var(--color-gray-2)',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'var(--color-white)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
              onBlur={(e) => {
                if (!phoneError) e.target.style.borderColor = 'var(--color-gray-2)';
              }}
            />
            {phoneError && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  minHeight: '18px',
                }}
              >
                {phoneError}
              </div>
            )}
            {!phoneError && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 주소 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="address"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gray-5)',
              }}
            >
              주소 <span style={{ color: 'var(--color-point-main)' }}>*</span>
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="주소를 입력하세요"
              maxLength={255}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: addressError ? '1px solid var(--color-point-main)' : '1px solid var(--color-gray-2)',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'var(--color-white)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-point-main)')}
              onBlur={(e) => {
                if (!addressError) e.target.style.borderColor = 'var(--color-gray-2)';
              }}
            />
            {addressError && (
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-point-main)',
                  minHeight: '18px',
                }}
              >
                {addressError}
              </div>
            )}
            {!addressError && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 에러 메시지 */}
          {submitError && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--color-gray-1)',
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
            {isLoading ? '처리 중...' : '완료'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
