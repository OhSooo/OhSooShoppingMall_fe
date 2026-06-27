import {
  API_BASE_URL,
  defaultFetchOptions,
  handleApiResponse,
} from '../../../api/config';
import type {
  BaseResponse,
  LocalLoginRequest,
  AccessTokenResponse,
} from '../../../api/types';

/**
 * 로컬 로그인
 * - refresh token은 HttpOnly 쿠키로 전달됨
 * - access token은 JSON body로 반환됨
 */
export async function loginLocal(
  request: LocalLoginRequest
): Promise<BaseResponse<AccessTokenResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/login/local`, {
    ...defaultFetchOptions,
    method: 'POST',
    credentials: 'include', // 쿠키를 포함하기 위해 필요
    body: JSON.stringify(request),
  });

  return handleApiResponse<AccessTokenResponse>(response);
}

/**
 * AccessToken 재발급
 * - refresh token은 HttpOnly 쿠키에서 읽음
 * - access token은 JSON body로 반환됨
 */
export async function reissueAccessToken(): Promise<BaseResponse<AccessTokenResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/token/reissue`, {
    ...defaultFetchOptions,
    method: 'POST',
    credentials: 'include', // 쿠키를 포함하기 위해 필요
  });

  return handleApiResponse<AccessTokenResponse>(response);
}

/**
 * 로그아웃
 * - refresh token을 무효화
 * - refresh token 쿠키를 만료시킴
 */
export async function logout(): Promise<BaseResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    ...defaultFetchOptions,
    method: 'POST',
    credentials: 'include', // 쿠키를 포함하기 위해 필요
  });

  return handleApiResponse<null>(response);
}
