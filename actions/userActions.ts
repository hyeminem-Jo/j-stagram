'use server';

import { createServerSupabaseAdminClient } from 'utils/supabase/server';
import { handleError } from './actionUtils';

export type UserInfo = {
  id: string;
  email: string;
  phone: string;
  created_at: string;
  last_sign_in_at: string;
  user_metadata: {
    preferred_username?: string;
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
};

// Supabase Auth User를 UserInfo 타입으로 변환
function transformUserToUserInfo(user: any): UserInfo {
  return {
    id: user.id,
    email: user.email || '',
    phone: user.phone || '',
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
    user_metadata: user.user_metadata || {},
  };
}

// 에러 처리 및 로깅
async function handleUserAction<T>(
  actionName: string,
  action: () => Promise<T>,
): Promise<T | null> {
  try {
    return await action();
  } catch (error) {
    console.error(`Error in ${actionName}:`, error);
    handleError(error);
    return null;
  }
}

/**
 * username으로 사용자를 찾아서 반환하는 함수
 * @param username - 찾을 사용자명 (카카오 preferred_username 또는 이메일의 @ 앞부분), 현재는 아직 uid 로 판별
 * @returns 사용자 정보 or null
 */
export async function getUserByUsername(username: string): Promise<UserInfo | null> {
  return handleUserAction('getUserByUsername', async () => {
    const supabaseAdmin = await createServerSupabaseAdminClient();

    // 모든 사용자 목록 가져오기
    const { data: allUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError || !allUsers.users) {
      console.error('Failed to fetch users:', usersError);
      return null;
    }

    // username으로 사용자 찾기 (UUID, preferred_username, 이메일 앞부분 모두 지원)
    const targetUser = allUsers.users.find((user: any) => {
      const preferredUsername = user?.user_metadata?.preferred_username;
      const emailUsername = user?.email?.split('@')[0];
      const userId = user?.id;

      return (
        userId === username || // UUID 직접 매칭
        preferredUsername === username || // 카카오 preferred_username 매칭
        emailUsername === username // 이메일 앞부분 매칭
      );
    });

    if (!targetUser) {
      return null;
    }

    return transformUserToUserInfo(targetUser);
  });
}

/**
 * 사용자 ID로 사용자를 찾아서 반환하는 함수
 * @param userId - 찾을 사용자 ID
 * @returns 사용자 정보 or null
 */
export async function getUserById(userId: string): Promise<UserInfo | null> {
  return handleUserAction('getUserById', async () => {
    const supabaseAdmin = await createServerSupabaseAdminClient();

    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !user.user) {
      console.error('Failed to fetch user by ID:', error);
      return null;
    }

    return transformUserToUserInfo(user.user);
  });
}

/**
 * 현재 로그인한 사용자 정보를 반환하는 함수
 * @returns 현재 사용자 정보 또는 null
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  return handleUserAction('getCurrentUser', async () => {
    const supabaseAdmin = await createServerSupabaseAdminClient();

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser();

    if (error || !user) {
      return null;
    }

    return transformUserToUserInfo(user);
  });
}
