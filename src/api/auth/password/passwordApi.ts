import {
  API_BASE_URL,
  defaultFetchOptions,
  handleApiResponse,
} from '../../../api/config';
import type {
  BaseResponse,
  PasswordResetRequest,
  PasswordResetResponse,
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
