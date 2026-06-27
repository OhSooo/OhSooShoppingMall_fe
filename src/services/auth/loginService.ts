import {
  loginLocal as loginLocalApi,
  reissueAccessToken as reissueAccessTokenApi,
  logout as logoutApi,
} from '../../api/auth/login/loginApi';
import type { LocalLoginRequest } from '../../api/types';

/**
 * 로컬 로그인 서비스
 * - access token을 localStorage에 저장
 * - refresh token은 HttpOnly 쿠키로 자동 저장됨
 */
export async function loginLocal(request: LocalLoginRequest) {
  const response = await loginLocalApi(request);

  if (!response.data) {
    throw new Error('로그인 응답 데이터가 없습니다.');
  }

  // Access token 저장
  const { accessToken, tokenType, expiresIn } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('tokenType', tokenType);
  localStorage.setItem('tokenExpiresIn', expiresIn.toString());
  
  // 만료 시간 계산하여 저장 (현재 시간 + expiresIn 초)
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem('tokenExpiresAt', expiresAt.toString());

  return response.data;
}

/**
 * AccessToken 재발급 서비스
 * - refresh token을 사용하여 access token 재발급
 * - 새로운 access token을 localStorage에 저장
 */
export async function reissueToken() {
  const response = await reissueAccessTokenApi();

  if (!response.data) {
    throw new Error('토큰 재발급 응답 데이터가 없습니다.');
  }

  // 새로운 access token 저장
  const { accessToken, tokenType, expiresIn } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('tokenType', tokenType);
  localStorage.setItem('tokenExpiresIn', expiresIn.toString());
  
  // 만료 시간 계산하여 저장
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem('tokenExpiresAt', expiresAt.toString());

  return response.data;
}

/**
 * 로그아웃 서비스
 * - localStorage에서 토큰 정보 제거
 * - refresh token 쿠키는 서버에서 만료시킴
 */
export async function logout() {
  try {
    await logoutApi();
  } catch (error) {
    // API 호출 실패해도 클라이언트 측 토큰은 제거
    console.error('로그아웃 API 호출 실패:', error);
  } finally {
    // localStorage에서 토큰 정보 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpiresIn');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('role');
  }
}
