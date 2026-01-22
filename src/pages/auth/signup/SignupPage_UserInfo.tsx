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

type Props = {
  onPrev: () => void;
};

export default function SignupPage_UserInfo({ onPrev }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { name, birth, gender, phone, address } = useAppSelector(
    (state) => state.signup
  );

  const [nameError, setNameError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  const validateName = (value: string): string => {
    if (!value) {
      return '이름을 입력해주세요.';
    }
    if (value.length < 2) {
      return '이름은 2자 이상이어야 합니다.';
    }
    return '';
  };

  const validateBirth = (value: string): string => {
    if (!value) {
      return '생년월일을 입력해주세요.';
    }
    // YYYY-MM-DD 형식 검사
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return '올바른 날짜 형식(YYYY-MM-DD)을 입력해주세요.';
    }
    return '';
  };

  const validatePhone = (value: string): string => {
    if (!value) {
      return '전화번호를 입력해주세요.';
    }
    // 전화번호 형식 검사 (010-1234-5678 또는 01012345678)
    const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(value.replace(/-/g, ''))) {
      return '올바른 전화번호 형식을 입력해주세요.';
    }
    return '';
  };

  const validateAddress = (value: string): string => {
    if (!value) {
      return '주소를 입력해주세요.';
    }
    return '';
  };

  const handleNameChange = (value: string) => {
    dispatch(setName(value));
    setNameError(validateName(value));
  };

  const handleBirthChange = (value: string) => {
    dispatch(setBirth(value));
    setBirthError(validateBirth(value));
  };

  const handlePhoneChange = (value: string) => {
    dispatch(setPhone(value));
    setPhoneError(validatePhone(value));
  };

  const handleAddressChange = (value: string) => {
    dispatch(setAddress(value));
    setAddressError(validateAddress(value));
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

  const handleSubmit = () => {
    // 모든 필드 검증
    const nameErr = validateName(name);
    const birthErr = validateBirth(birth);
    const phoneErr = validatePhone(phone);
    const addressErr = validateAddress(address);

    setNameError(nameErr);
    setBirthError(birthErr);
    setPhoneError(phoneErr);
    setAddressError(addressErr);

    if (!nameErr && !birthErr && !phoneErr && !addressErr) {
      // TODO: 실제 회원가입 API 호출
      // 회원가입 성공 후 welcome 페이지로 이동
      // dispatch(resetSignupData()); // 필요시 데이터 초기화
      navigate('/signup/welcome');
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
          placeholder="이름을 입력하세요"
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
          placeholder="010-1234-5678"
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
          placeholder="주소를 입력하세요"
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
          disabled={!isFormValid()}
          style={{
            flex: 1,
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--color-white)',
            backgroundColor: isFormValid() ? 'var(--color-point-main)' : '#9D9D9D',
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
          가입하기
        </button>
      </div>
    </div>
  );
}
