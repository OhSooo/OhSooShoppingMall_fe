import {
  API_BASE_URL,
  authenticatedFetch,
  handleApiResponse,
} from '../../api/config';
import type {
  BaseResponse,
  UserMeResponse,
  UserProfileUpdateRequest,
} from '../../api/types';

/**
 * 내 정보 조회
 * - 인증: AccessToken 필요
 */
export async function getMe(): Promise<BaseResponse<UserMeResponse>> {
  const response = await authenticatedFetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
  });

  return handleApiResponse<UserMeResponse>(response);
}

/**
 * 내 정보 조회 (AccessToken 직접 전달)
 * - 콜백 페이지 등에서 accessToken을 직접 전달할 때 사용
 */
export async function getMeWithToken(
  accessToken: string
): Promise<BaseResponse<UserMeResponse>> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleApiResponse<UserMeResponse>(response);
}

/**
 * 내 프로필 수정
 * - 인증: AccessToken 필요
 * - 온보딩(추가정보 입력)과 마이페이지 수정 모두 이 엔드포인트로 처리
 */
export async function updateMe(
  request: UserProfileUpdateRequest
): Promise<BaseResponse<null>> {
  const response = await authenticatedFetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });

  return handleApiResponse<null>(response);
}
