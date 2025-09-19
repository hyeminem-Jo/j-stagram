'use server';

import { createServerSupabaseAdminClient, createServerSupabaseClient } from 'utils/supabase/server';
import { Database } from 'types_db';
import { handleError } from './actionUtils';

export type PostRow = Database['public']['Tables']['posts']['Row'];
export type PostRowInsert = Database['public']['Tables']['posts']['Insert'];
export type PostRowUpdate = Database['public']['Tables']['posts']['Update'];

// 이미지가 포함된 게시글 타입
export type PostWithImages = {
  id: number;
  title: string;
  content: string;
  images: { url: string }[];
  user_id: string;
  created_at: string;
  user_info?: {
    email?: string;
    user_metadata?: {
      preferred_username?: string;
      name?: string;
      avatar_url?: string;
    };
  } | null;
};

export async function getPosts({ searchInput = '' }): Promise<PostWithImages[]> {
  const supabase = await createServerSupabaseClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      user_id,
      created_at,
      images (url)
    `,
    ) // posts + 연결된 images 배열 가져오기
    .eq('is_public', true)
    .like('title', `%${searchInput}%`)
    .order('created_at', { ascending: true });

  if (error) handleError(error);

  // Admin client 사용 (service_role)
  const supabaseAdmin = await createServerSupabaseAdminClient();
  const { data: allUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

  if (usersError) handleError(usersError);

  // 유저 매핑
  const userMap = new Map(
    allUsers.users.map((u) => [
      u.id,
      {
        email: u.email,
        user_metadata: u.user_metadata,
      },
    ]),
  );

  return posts.map((post) => ({
    ...post,
    images: post.images ?? [],
    user_info: userMap.get(post.user_id) ?? null,
  }));
}

export async function createPost(post: PostRowInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...post,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) handleError(error);
  return data;
}

export async function updatePost(post: PostRowUpdate) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...post,
      updated_at: new Date().toISOString(),
    })
    .eq('id', post.id); // 게시글 아이디와 일치하는 게시글 업데이트
  if (error) handleError(error);
  return data;
}

export async function deletePost(postId: number) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) handleError(error);
  return data;
}
