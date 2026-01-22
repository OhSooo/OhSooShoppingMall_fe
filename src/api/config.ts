import type { BaseResponse } from './types';
import { getValidAccessToken } from '../utils/tokenManager';
import { reissueToken } from '../services/auth/loginService';

// API Base URL 설정
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 공통 fetch 옵션
export const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// API 에러 클래스
export class ApiError extends Error {
  constructor(
    public status: number,
    public errorCode: string,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API 응답 처리 헬퍼
export async function handleApiResponse<T>(
  response: Response
): Promise<BaseResponse<T>> {
  const data: BaseResponse<T> = await response.json();

  // BaseResponse의 success가 false이거나 HTTP 상태가 에러인 경우
  if (!data.success || !response.ok) {
    // 에러 코드 추출 (백엔드 BaseErrorCode의 code 필드)
    // 응답 본문에서 code를 찾거나, HTTP 상태 코드 사용
    const errorCode = data.code?.toString() || `HTTP_${response.status}`;
    throw new ApiError(
      response.status,
      errorCode,
      data.message || `HTTP error! status: ${response.status}`,
      data
    );
  }

  return data;
}

/**
 * 인증이 필요한 API 호출을 위한 fetch wrapper
 * - AccessToken을 자동으로 헤더에 추가
 * - 401 에러 발생 시 자동으로 토큰 재발급 후 재시도
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // 토큰이 만료되었거나 곧 만료될 경우 자동으로 재발급
  const accessToken = await getValidAccessToken();
  
  // 헤더에 토큰 추가
  const headers = new Headers(options.headers);
  if (accessToken) {
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    headers.set('Authorization', `${tokenType} ${accessToken}`);
  }

  // 첫 번째 요청 시도
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // 쿠키 포함
  });

  // 401 에러이고 토큰이 있는 경우 재발급 후 재시도
  if (response.status === 401 && accessToken) {
    try {
      // 토큰 재발급
      await reissueToken();
      
      // 새로운 토큰으로 재시도
      const newAccessToken = localStorage.getItem('accessToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      
      if (newAccessToken) {
        const retryHeaders = new Headers(options.headers);
        retryHeaders.set('Authorization', `${tokenType} ${newAccessToken}`);
        
        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: 'include',
        });
      }
    } catch (error) {
      // 재발급 실패 시 원래 응답 반환
      console.error('토큰 재발급 실패:', error);
    }
  }

  return response;
}
