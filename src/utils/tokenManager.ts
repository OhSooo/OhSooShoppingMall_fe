import { reissueToken } from '../services/auth/loginService';

/**
 * AccessToken이 만료되었는지 확인
 */
export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  if (!expiresAt) {
    return true; // 만료 시간 정보가 없으면 만료된 것으로 간주
  }

  const expiresAtTime = parseInt(expiresAt, 10);
  const now = Date.now();
  
  // 만료 시간 30초 전이면 만료된 것으로 간주 (여유 시간 확보)
  return now >= expiresAtTime - 30000;
}

/**
 * AccessToken이 유효한지 확인 (존재하고 만료되지 않음)
 */
export function isTokenValid(): boolean {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return false;
  }

  return !isTokenExpired();
}

/**
 * AccessToken 재발급 (만료된 경우에만)
 * - 토큰이 만료되었거나 곧 만료될 경우 자동으로 재발급
 */
export async function ensureValidToken(): Promise<string | null> {
  const accessToken = localStorage.getItem('accessToken');
  
  // 토큰이 없으면 재발급 불가
  if (!accessToken) {
    return null;
  }

  // 토큰이 만료되었거나 곧 만료될 경우 재발급
  if (isTokenExpired()) {
    try {
      const response = await reissueToken();
      return response.accessToken;
    } catch (error) {
      console.error('토큰 재발급 실패:', error);
      // 재발급 실패 시 기존 토큰 반환 (서버에서 검증할 것)
      return accessToken;
    }
  }

  return accessToken;
}

/**
 * API 요청 전에 토큰을 확인하고 필요시 재발급
 * - fetch 요청 전에 호출하여 토큰을 최신 상태로 유지
 */
export async function getValidAccessToken(): Promise<string | null> {
  return await ensureValidToken();
}
