/**
 * 데이터 타입 전환 유틸리티 함수들
 */

/**
 * 생년월일 형식 변환
 * YYYYMMDD -> YYYY-MM-DD
 */
export function formatBirthDate(dateString: string): string {
  if (!dateString) return '';

  // 이미 YYYY-MM-DD 형식인 경우
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // YYYYMMDD 형식인 경우
  if (dateString.length === 8 && /^\d+$/.test(dateString)) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  return dateString;
}

/**
 * 전화번호 형식 변환
 * 01012345678 -> 010-1234-5678
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';

  // 이미 하이픈이 있는 경우
  if (phone.includes('-')) {
    return phone;
  }

  // 숫자만 추출
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }

  return phone;
}

/**
 * 전화번호에서 하이픈 제거
 */
export function removePhoneHyphens(phone: string): string {
  return phone.replace(/-/g, '');
}
