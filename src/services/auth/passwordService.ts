import { changePassword as changePasswordApi } from '../../api/auth/password/passwordApi';
import type { PasswordChangeRequest } from '../../api/types';

/**
 * 비밀번호 변경 서비스
 */
export async function changePassword(request: PasswordChangeRequest) {
  const response = await changePasswordApi(request);

  if (!response.data) {
    throw new Error('비밀번호 변경 응답 데이터가 없습니다.');
  }

  return response.data;
}
