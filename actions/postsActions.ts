'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';
import { Database } from 'types_db';
import { handleError } from './actionUtils';

export type PostRow = Database['public']['Tables']['posts']['Row'];
export type PostRowInsert = Database['public']['Tables']['posts']['Insert'];
export type PostRowUpdate = Database['public']['Tables']['posts']['Update'];

// export async function getPosts({ searchInput = '' }): Promise<PostRow[]> {
//   const supabase = await createServerSupabaseClient();
//   const { data, error } = await supabase
//     .from('posts')
//     .select('*') // 모든 필드 선택
//     .eq('is_public', true) // 공개된 게시글만 가져오기
//     .like('title', `%${searchInput}%`) // 검색된 게시글 찾기, 빈값이면 전체 게시글 찾기
//     .order('created_at', { ascending: true }); // 생성일 기준 오름차순 정렬

//   if (error) handleError(error);
//   return data;
// }

export async function getPosts({ searchInput = '' }): Promise<PostRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      images (url)
    `,
    ) // posts + 연결된 images 배열 가져오기
    .eq('is_public', true)
    .like('title', `%${searchInput}%`)
    .order('created_at', { ascending: true });

  if (error) handleError(error);

  // images 배열이 항상 존재하게 하고 싶으면 null 처리
  return data.map((post) => ({
    ...post,
    images: post.images ?? [],
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
