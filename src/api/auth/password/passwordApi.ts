import {
  API_BASE_URL,
  authenticatedFetch,
  handleApiResponse,
} from '../../../api/config';
import type {
  BaseResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
} from '../../../api/types';

/**
 * 비밀번호 재발급(임시 비밀번호 발송)
 * - 이메일로 임시 비밀번호를 발송합니다.
 * - 인증이 필요 없는 공개 API입니다.
 */
export async function resetPassword(
  request: PasswordResetRequest
): Promise<BaseResponse<PasswordResetResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/password/reset`, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(request),
  });

  return handleApiResponse<PasswordResetResponse>(response);
}

/**
 * 비밀번호 변경
 * - 인증: AccessToken 필요
 * - 현재 비밀번호 검증 후 새 비밀번호로 변경
 */
export async function changePassword(
  request: PasswordChangeRequest
): Promise<BaseResponse<PasswordChangeResponse>> {
  const response = await authenticatedFetch(`${API_BASE_URL}/auth/password`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });

  return handleApiResponse<PasswordChangeResponse>(response);
}
