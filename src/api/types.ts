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

// 로컬 로그인 Request
export interface LocalLoginRequest {
  email: string;
  password: string;
}

// AccessToken Response
export interface AccessTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number; // 만료 시간(초)
}

// 비밀번호 재발급 Request
export interface PasswordResetRequest {
  email: string;
}

// 비밀번호 재발급 Response
export interface PasswordResetResponse {
  accepted: boolean;
  email: string;
}

// 비밀번호 변경 Request
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

// 비밀번호 변경 Response
export interface PasswordChangeResponse {
  changed: boolean;
  changedAt: string; // ISO 8601 형식 (OffsetDateTime)
}

// 사용자 프로필 수정 Request
export interface UserProfileUpdateRequest {
  name?: string;
  birth?: string; // YYYY-MM-DD 형식 (LocalDate)
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address?: string;
}

// 내 정보 조회 Response
export interface UserMeResponse {
  userId: number;
  name: string;
  birth: string; // YYYY-MM-DD 형식 (LocalDate)
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  address: string;
  role: 'USER' | 'STORE_OWNER' | 'ADMIN';
  onboarded: boolean;
}
