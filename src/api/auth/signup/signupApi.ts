import {
  API_BASE_URL,
  defaultFetchOptions,
  handleApiResponse,
} from '../../../api/config';
import type {
  BaseResponse,
  EmailVerificationSendRequest,
  EmailVerificationSendResponse,
  EmailVerificationConfirmRequest,
  EmailVerificationResponse,
  LocalSignupRequest,
  LocalSignupResponse,
} from '../../types';

/**
 * 이메일 인증번호 발송
 */
export async function sendEmailVerificationCode(
  request: EmailVerificationSendRequest
): Promise<BaseResponse<EmailVerificationSendResponse>> {
  const response = await fetch(
    `${API_BASE_URL}/auth/email/verification/send`,
    {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify(request),
    }
  );

  return handleApiResponse<EmailVerificationSendResponse>(response);
}

/**
 * 이메일 인증번호 확인
 */
export async function confirmEmailVerificationCode(
  request: EmailVerificationConfirmRequest
): Promise<BaseResponse<EmailVerificationResponse>> {
  const response = await fetch(
    `${API_BASE_URL}/auth/email/verification/confirm`,
    {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify(request),
    }
  );

  return handleApiResponse<EmailVerificationResponse>(response);
}

/**
 * 로컬 회원가입
 */
export async function signupLocal(
  request: LocalSignupRequest
): Promise<BaseResponse<LocalSignupResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/signup/local`, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(request),
  });

  return handleApiResponse<LocalSignupResponse>(response);
}
