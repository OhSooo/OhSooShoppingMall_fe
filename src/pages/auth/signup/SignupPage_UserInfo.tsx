import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setName,
  setBirth,
  setGender,
  setPhone,
  setAddress,
  resetSignupData,
  type Gender,
} from '../../../store/signupSlice';
import { submitSignup } from '../../../services/auth/signupService';
import { ApiError } from '../../../api/config';
import {
  validateName,
  validateBirth,
  validatePhone,
  validateAddress,
} from '../../../utils/validation';

type Props = {
  onPrev: () => void;
};

export default function SignupPage_UserInfo({ onPrev }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { email, password, name, birth, gender, phone, address } = useAppSelector(
    (state) => state.signup
  );

  const [nameError, setNameError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleNameChange = (value: string) => {
    dispatch(setName(value));
    const validation = validateName(value);
    setNameError(validation.message);
  };

  const handleBirthChange = (value: string) => {
    dispatch(setBirth(value));
    const validation = validateBirth(value);
    setBirthError(validation.message);
  };

  const handlePhoneChange = (value: string) => {
    // 숫자만 입력받기
    const numbersOnly = value.replace(/\D/g, '');
    dispatch(setPhone(numbersOnly));
    const validation = validatePhone(numbersOnly);
    setPhoneError(validation.message);
  };

  const handleAddressChange = (value: string) => {
    dispatch(setAddress(value));
    const validation = validateAddress(value);
    setAddressError(validation.message);
  };

  const isFormValid = () => {
    return (
      name &&
      birth &&
      phone &&
      address &&
      !nameError &&
      !birthError &&
      !phoneError &&
      !addressError
    );
  };

  const handleSubmit = async () => {
    // 모든 필드 검증
    const nameValidation = validateName(name);
    const birthValidation = validateBirth(birth);
    const phoneValidation = validatePhone(phone);
    const addressValidation = validateAddress(address);

    setNameError(nameValidation.message);
    setBirthError(birthValidation.message);
    setPhoneError(phoneValidation.message);
    setAddressError(addressValidation.message);

    if (
      nameValidation.isValid &&
      birthValidation.isValid &&
      phoneValidation.isValid &&
      addressValidation.isValid
    ) {
      setIsLoading(true);
      setSubmitError('');

      try {
        const result = await submitSignup({
          email,
          password,
          name,
          birth,
          gender,
          phone,
          address,
        });

        // 회원가입 성공 후 데이터 초기화
        dispatch(resetSignupData());
        // WelcomePage에 name 전달
        navigate('/signup/welcome', { state: { name: result.name } });
      } catch (error) {
        if (error instanceof ApiError) {
          setSubmitError(error.message || '회원가입에 실패했습니다.');
        } else {
          setSubmitError('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
      } finally {
        setIsLoading(false);
      }
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
          이름
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="이름을 입력하세요 (2자 이상)"
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
          생년월일
        </label>
        <input
          id="birth"
          type="date"
          value={birth}
          onChange={(e) => handleBirthChange(e.target.value)}
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
          성별
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
                onChange={(e) => dispatch(setGender(e.target.value as Gender))}
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
        <div style={{ minHeight: '18px' }}></div>
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
          전화번호
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="전화번호를 입력하세요 (숫자만, 예: 01012345678)"
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
          주소
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="주소를 입력하세요 (예: 서울시 강남구 테헤란로 123)"
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
          onClick={handleSubmit}
          disabled={!isFormValid() || isLoading}
          style={{
            flex: 1,
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--color-white)',
            backgroundColor: isFormValid() && !isLoading ? 'var(--color-point-main)' : '#9D9D9D',
            border: 'none',
            borderRadius: '6px',
            cursor: isFormValid() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (isFormValid() && !isLoading) e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
          }}
          onMouseLeave={(e) => {
            if (isFormValid() && !isLoading) e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
          }}
        >
          {isLoading ? '가입 중...' : '가입하기'}
        </button>
      </div>
      {submitError && (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--color-point-main)',
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          {submitError}
        </div>
      )}
    </div>
  );
}
