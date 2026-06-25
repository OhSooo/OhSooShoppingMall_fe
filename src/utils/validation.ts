/**
 * 유효성 검사 유틸리티 함수들
 */

/**
 * 이메일 유효성 검사
 */
export function validateEmail(email: string): { isValid: boolean; message: string } {
  if (!email) {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 비밀번호 유효성 검사
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (!password) {
    return { isValid: false, message: '비밀번호를 입력해주세요.' };
  }

  if (password.length < 8) {
    return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }

  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: '비밀번호는 영문과 숫자를 포함해야 합니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 비밀번호 확인 유효성 검사
 */
export function validatePasswordConfirm(
  password: string,
  passwordConfirm: string
): { isValid: boolean; message: string } {
  if (!passwordConfirm) {
    return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
  }

  if (password !== passwordConfirm) {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 이름 유효성 검사
 */
export function validateName(name: string): { isValid: boolean; message: string } {
  if (!name) {
    return { isValid: false, message: '이름을 입력해주세요.' };
  }

  if (name.length < 2) {
    return { isValid: false, message: '이름은 2자 이상이어야 합니다.' };
  }

  if (name.length > 50) {
    return { isValid: false, message: '이름은 50자 이하여야 합니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 생년월일 유효성 검사
 */
export function validateBirth(birth: string): { isValid: boolean; message: string } {
  if (!birth) {
    return { isValid: false, message: '생년월일을 입력해주세요.' };
  }

  // YYYY-MM-DD 형식 검사
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(birth)) {
    return { isValid: false, message: '올바른 날짜 형식(YYYY-MM-DD)을 입력해주세요.' };
  }

  // 실제 날짜인지 확인
  const date = new Date(birth);
  if (isNaN(date.getTime())) {
    return { isValid: false, message: '올바른 날짜를 입력해주세요.' };
  }

  // 미래 날짜 체크
  const today = new Date();
  if (date > today) {
    return { isValid: false, message: '미래 날짜는 입력할 수 없습니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 전화번호 유효성 검사
 */
export function validatePhone(phone: string): { isValid: boolean; message: string } {
  if (!phone) {
    return { isValid: false, message: '전화번호를 입력해주세요.' };
  }

  // 숫자만 있는지 확인
  if (!/^\d+$/.test(phone)) {
    return { isValid: false, message: '전화번호는 숫자만 입력 가능합니다.' };
  }

  // 전화번호 형식 검사 (010으로 시작하는 10자리 또는 11자리)
  const phoneRegex = /^01[0-9]\d{7,8}$/;
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: '올바른 전화번호 형식을 입력해주세요. (예: 01012345678)' };
  }

  return { isValid: true, message: '' };
}

/**
 * 주소 유효성 검사
 */
export function validateAddress(address: string): { isValid: boolean; message: string } {
  if (!address) {
    return { isValid: false, message: '주소를 입력해주세요.' };
  }

  if (address.length > 255) {
    return { isValid: false, message: '주소는 255자 이하여야 합니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 우편번호(shippingPostcode) 유효성 검사 (5자리 숫자)
 */
export function validateShippingPostcode(
  shippingPostcode: string
): { isValid: boolean; message: string } {
  if (!shippingPostcode) {
    return { isValid: false, message: '우편번호를 입력해주세요.' };
  }

  if (!/^\d{5}$/.test(shippingPostcode)) {
    return { isValid: false, message: '우편번호는 5자리 숫자여야 합니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 상세주소(shippingAddressDetail) 유효성 검사
 */
export function validateShippingAddressDetail(
  shippingAddressDetail: string
): { isValid: boolean; message: string } {
  if (!shippingAddressDetail) {
    return { isValid: false, message: '상세주소를 입력해주세요.' };
  }

  if (shippingAddressDetail.length > 255) {
    return { isValid: false, message: '상세주소는 255자 이하여야 합니다.' };
  }

  return { isValid: true, message: '' };
}

/**
 * 인증번호 유효성 검사
 */
export function validateVerificationCode(code: string): { isValid: boolean; message: string } {
  if (!code) {
    return { isValid: false, message: '인증번호를 입력해주세요.' };
  }

  if (code.length !== 6) {
    return { isValid: false, message: '인증번호는 6자리여야 합니다.' };
  }

  if (!/^\d+$/.test(code)) {
    return { isValid: false, message: '인증번호는 숫자만 입력 가능합니다.' };
  }

  return { isValid: true, message: '' };
}
