import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';
import SuccessModal from '../../../components/modal/SuccessModal';
import { getMyInfo, updateMyProfile } from '../../../services/user/userService';
import AddressInput from '../../../components/signup/AddressInput';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export default function MyInfoManagePage() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [phone, setPhone] = useState('');
  const [shippingPostcode, setShippingPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [shippingAddressDetail, setShippingAddressDetail] = useState('');

  const [nameError, setNameError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [shippingAddressDetailError, setShippingAddressDetailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 페이지 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoadingData(true);
        const userInfo = await getMyInfo();
        
        setName(userInfo.name || '');
        setBirth(userInfo.birth || '');
        setGender(userInfo.gender || '');
        setPhone(userInfo.phone || '');
        setShippingPostcode(userInfo.shippingPostcode || '');
        setAddress(userInfo.address || '');
        setShippingAddressDetail(userInfo.shippingAddressDetail || '');
      } catch (error: any) {
        console.error('사용자 정보 조회 실패:', error);
        setSubmitError(error?.message || '사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserInfo();
  }, []);

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

  const handleAddressChange = (value: {
    shippingPostcode: string;
    address: string;
    shippingAddressDetail: string;
  }) => {
    setShippingPostcode(value.shippingPostcode);
    setAddress(value.address);
    setShippingAddressDetail(value.shippingAddressDetail);
    setAddressError(value.address.length > 255 ? '주소는 255자 이하로 입력해주세요.' : '');
    setShippingAddressDetailError(
      value.shippingAddressDetail.length > 255 ? '상세주소는 255자 이하로 입력해주세요.' : ''
    );
  };

  const isFormValid = () => {
    return (
      name &&
      birth &&
      phone &&
      address &&
      shippingPostcode &&
      shippingAddressDetail &&
      !nameError &&
      !birthError &&
      !phoneError &&
      !addressError &&
      !shippingAddressDetailError
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드 검증
    const nameValidation = name.length >= 2 && name.length <= 255;
    const birthValidation = birth && new Date(birth) <= new Date();
    const phoneValidation = phone.length >= 10 && phone.length <= 50;
    const addressValidation = address.length <= 255;
    const shippingPostcodeValidation = /^\d{5}$/.test(shippingPostcode);
    const shippingAddressDetailValidation =
      shippingAddressDetail.length > 0 && shippingAddressDetail.length <= 255;

    if (!nameValidation) {
      setNameError(name.length < 2 ? '이름은 2자 이상 입력해주세요.' : '이름은 255자 이하로 입력해주세요.');
    }
    if (!birthValidation) {
      setBirthError('올바른 생년월일을 입력해주세요.');
    }
    if (!phoneValidation) {
      setPhoneError('전화번호는 10자 이상 50자 이하로 입력해주세요.');
    }
    if (!addressValidation) {
      setAddressError('주소는 255자 이하로 입력해주세요.');
    }
    if (!shippingPostcodeValidation && !addressError) {
      setAddressError('우편번호 찾기로 주소를 선택해주세요.');
    }
    if (!shippingAddressDetailValidation) {
      setShippingAddressDetailError('상세주소를 입력해주세요.');
    }

    if (
      nameValidation &&
      birthValidation &&
      phoneValidation &&
      addressValidation &&
      shippingPostcodeValidation &&
      shippingAddressDetailValidation &&
      gender
    ) {
      setIsLoading(true);
      setSubmitError('');

      try {
        await updateMyProfile({
          name,
          birth,
          gender: gender as Gender,
          phone,
          address,
          shippingPostcode,
          shippingAddressDetail,
        });
        
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/mypage');
        }, 2300); // 모달이 사라진 후 이동
      } catch (error: any) {
        setSubmitError(error?.message || '정보 변경에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <PageShell>
      {showSuccessModal && (
        <SuccessModal
          message="정보가 성공적으로 변경되었습니다."
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
            내 정보 변경
          </h1>
        </div>

        {/* 로딩 중 표시 */}
        {isLoadingData ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              color: 'var(--color-gray-4)',
            }}
          >
            정보를 불러오는 중...
          </div>
        ) : (
          /* 폼 */
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
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="이름을 입력하세요 (2자 이상)"
              maxLength={255}
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
                    onChange={(e) => setGender(e.target.value as Gender)}
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
              maxLength={50}
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

          {/* 주소 입력 (우편번호 찾기 + 상세주소) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <AddressInput
              value={{ shippingPostcode, address, shippingAddressDetail }}
              onChange={handleAddressChange}
              error={addressError}
              shippingAddressDetailError={shippingAddressDetailError}
            />
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
            {isLoading ? '수정 중...' : '수정'}
          </button>
        </form>
        )}
      </div>
    </PageShell>
  );
}
