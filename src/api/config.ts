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
  const accessToken = await getValidAccessToken();

  // ✅ 기존 headers + defaultFetchOptions.headers 를 합쳐서 시작
  const headers = new Headers(defaultFetchOptions.headers);
  new Headers(options.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  // ✅ Authorization 추가
  if (accessToken) {
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    headers.set('Authorization', `${tokenType} ${accessToken}`);
  }

  // ✅ body가 있는데 Content-Type이 비어있으면 JSON으로 보장
  // (defaultFetchOptions로 이미 json이긴 한데, 혹시 호출부에서 지웠을 때 대비)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && accessToken) {
    try {
      await reissueToken();

      const newAccessToken = localStorage.getItem('accessToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';

      if (newAccessToken) {
        // ✅ retry도 동일하게 헤더 merge + Content-Type 유지
        const retryHeaders = new Headers(defaultFetchOptions.headers);
        new Headers(options.headers).forEach((value, key) => {
          retryHeaders.set(key, value);
        });
        retryHeaders.set('Authorization', `${tokenType} ${newAccessToken}`);

        if (options.body && !retryHeaders.has('Content-Type')) {
          retryHeaders.set('Content-Type', 'application/json');
        }

        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('토큰 재발급 실패:', error);
    }
  }

  return response;
}
