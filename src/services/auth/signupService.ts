import {
  sendEmailVerificationCode,
  confirmEmailVerificationCode,
  signupLocal,
} from '../../api/auth/signup/signupApi';
import { normalizeSignupRequest, normalizeSignupResponse } from './normalizeSignup';
import type { Gender } from '../../store/signupSlice';
import type {
  EmailVerificationSendRequest,
  EmailVerificationConfirmRequest,
} from '../../api/types';

/**
 * 이메일 인증번호 발송 서비스
 */
export async function sendVerificationCode(email: string) {
  const request: EmailVerificationSendRequest = { email };
  const response = await sendEmailVerificationCode(request);
  
  if (!response.data) {
    throw new Error('응답 데이터가 없습니다.');
  }
  
  return response.data; // EmailVerificationSendResponse 반환
}

/**
 * 이메일 인증번호 확인 서비스
 */
export async function verifyCode(email: string, code: string) {
  const request: EmailVerificationConfirmRequest = { email, code };
  const response = await confirmEmailVerificationCode(request);
  
  if (!response.data) {
    throw new Error('응답 데이터가 없습니다.');
  }
  
  return response.data; // EmailVerificationResponse 반환
}

/**
 * 로컬 회원가입 서비스
 * Redux store의 데이터를 API 요청 형식으로 변환
 */
export async function submitSignup(data: {
  email: string;
  password: string;
  name: string;
  birth: string;
  gender: Gender;
  phone: string;
  address: string;
  shippingPostcode?: string;
  shippingAddressDetail?: string;
}) {
  // 데이터 정제 (normalize)
  const request = normalizeSignupRequest(data);
  
  const response = await signupLocal(request);
  
  // 응답 데이터 정제
  return normalizeSignupResponse(response.data);
}
