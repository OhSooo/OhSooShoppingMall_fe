import type { Gender } from '../../store/signupSlice';
import type {
  LocalSignupRequest,
  LocalSignupResponse,
} from '../../api/types';
import { formatBirthDate, removePhoneHyphens } from '../../utils/transform';

/**
 * 회원가입 요청 데이터 정제
 * Redux store의 데이터를 API 요청 형식으로 변환
 */
export function normalizeSignupRequest(data: {
  email: string;
  password: string;
  name: string;
  birth: string;
  gender: Gender;
  phone: string;
  address: string;
}): LocalSignupRequest {
  return {
    email: data.email?.trim() || '',
    password: data.password || '',
    name: data.name?.trim() || '',
    birth: formatBirthDate(data.birth), // YYYY-MM-DD 형식으로 변환
    gender: data.gender || 'MALE',
    phone: removePhoneHyphens(data.phone) || '', // 하이픈 제거
    address: data.address?.trim() || '',
  };
}

/**
 * 회원가입 응답 데이터 정제
 * API 응답을 프론트엔드에서 사용할 형식으로 변환
 */
export function normalizeSignupResponse(
  data: LocalSignupResponse | null
): { name: string } {
  if (!data) {
    return {
      name: '',
    };
  }

  return {
    name: data.name || '',
  };
}
