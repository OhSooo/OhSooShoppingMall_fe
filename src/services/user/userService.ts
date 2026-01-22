import { getMe as getMeApi, updateMe as updateMeApi } from '../../api/users/userApi';
import type { UserProfileUpdateRequest, UserMeResponse } from '../../api/types';

/**
 * 내 정보 조회 서비스
 */
export async function getMyInfo(): Promise<UserMeResponse> {
  const response = await getMeApi();

  if (!response.data) {
    throw new Error('내 정보 조회 응답 데이터가 없습니다.');
  }

  return response.data;
}

/**
 * 내 프로필 수정 서비스
 */
export async function updateMyProfile(request: UserProfileUpdateRequest) {
  await updateMeApi(request);
}
