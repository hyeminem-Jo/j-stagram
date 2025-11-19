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
  like_count: number;
  user_info?: {
    email?: string;
    user_metadata?: {
      preferred_username?: string;
      name?: string;
      avatar_url?: string;
    };
  } | null;
};

// 사용자 정보 매핑
async function getUsersMap() {
  const supabaseAdmin = await createServerSupabaseAdminClient();
  const { data: allUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

  if (usersError) handleError(usersError);

  return new Map(
    allUsers.users.map((u) => [
      u.id,
      {
        email: u.email,
        user_metadata: u.user_metadata,
      },
    ]),
  );
}

// 게시물 - 사용자 매핑
async function mapPostsWithUserInfo(posts: any[]): Promise<PostWithImages[]> {
  const userMap = await getUsersMap();

  return posts.map((post) => ({
    ...post,
    images: post.images ?? [],
    user_info: userMap.get(post.user_id) ?? null,
  }));
}

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
      like_count,
      images (url)
    `,
    ) // posts + 연결된 images 배열 가져오기
    .eq('is_public', true)
    .like('title', `%${searchInput}%`)
    .order('created_at', { ascending: false }); // 최신순으로 불러오기

  if (error) handleError(error);

  return await mapPostsWithUserInfo(posts);
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

// URL에서 파일 경로 추출
function extractFilePathFromUrl(url: string): string | null {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
    const prefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;

    if (url.startsWith(prefix)) {
      return url.replace(prefix, '');
    }
    return null;
  } catch {
    return null;
  }
}

export async function deletePost(postId: number) {
  const supabase = await createServerSupabaseClient();

  // 1. 해당 post_id의 이미지들 가져오기
  const { data: images, error: imagesError } = await supabase
    .from('images')
    .select('url')
    .eq('post_id', postId);

  if (imagesError) handleError(imagesError);

  // 2. images 테이블에서 삭제
  if (images && images.length > 0) {
    // 사용자가 중복된 사진을 다른 게시글에 각각 올렸을 때 예외처리
    // 2-1. 각 이미지 URL이 다른 post_id에서도 사용되는지 확인
    const imagesToDeleteFromStorage: string[] = [];

    for (const image of images) {
      // 해당 URL이 다른 post_id에서도 사용되는지 확인
      const { data: otherPosts, error: checkError } = await supabase
        .from('images')
        .select('post_id')
        .eq('url', image.url)
        .neq('post_id', postId);

      if (checkError) {
        console.error('이미지 중복 확인 실패:', checkError);
        continue;
      }

      // 다른 게시글에서 사용되지 않는 경우에만 Storage 삭제 대상에 추가
      if (!otherPosts || otherPosts.length === 0) {
        const filePath = extractFilePathFromUrl(image.url);
        if (filePath) {
          imagesToDeleteFromStorage.push(filePath);
        }
      }
    }

    // 2-2. images 테이블에서 해당 post_id 의 레코드 삭제
    const { error: deleteImagesError } = await supabase
      .from('images')
      .delete()
      .eq('post_id', postId);

    if (deleteImagesError) handleError(deleteImagesError);

    // 2-3. 아예 다른 게시글에서도 사용되지 않는 이미지만 Storage에서 삭제
    if (imagesToDeleteFromStorage.length > 0) {
      const { error: storageError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .remove(imagesToDeleteFromStorage);

      if (storageError) {
        console.error('Storage 파일 삭제 실패:', storageError);
        // Storage 삭제 실패해도 게시글은 삭제 진행
      }
    }
  }

  console.log('postId', postId);

  // 3. posts 테이블에서 게시글 삭제
  const { data, error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) {
    console.error('게시글 삭제 실패:', error);
    handleError(error);
  }
  return data;
}

export async function getPostsByUserId(userId: string): Promise<PostWithImages[]> {
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
      like_count,
      images (url)
    `,
    )
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) handleError(error);

  return await mapPostsWithUserInfo(posts);
}

// 게시글에 이미지 추가
export async function createPostImages(postId: number, imageUrls: string[]) {
  const supabase = await createServerSupabaseClient();
  const imageInserts = imageUrls.map((url) => ({
    post_id: postId,
    url,
  }));

  const { data, error } = await supabase.from('images').insert(imageInserts).select();
  if (error) handleError(error);
  return data;
}
