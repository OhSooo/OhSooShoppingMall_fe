// Base Response 타입 (백엔드 BaseResponse와 일치)
export interface BaseResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
}

// 이메일 인증 발송 Request
export interface EmailVerificationSendRequest {
  email: string;
}

// 이메일 인증 발송 Response
export interface EmailVerificationSendResponse {
  email: string;
  expiresInSeconds: number; // 인증번호 유효시간(초)
}

// 이메일 인증 확인 Request
export interface EmailVerificationConfirmRequest {
  email: string;
  code: string;
}

// 이메일 인증 확인 Response
export interface EmailVerificationResponse {
  email: string;
  verified: boolean;
}

// 로컬 회원가입 Request
export interface LocalSignupRequest {
  email: string;
  password: string;
  name: string;
  birth: string; // YYYY-MM-DD 형식
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  address: string;
}

// 로컬 회원가입 Response
export interface LocalSignupResponse {
  name: string;
}
