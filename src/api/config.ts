import type { BaseResponse } from './types';

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
