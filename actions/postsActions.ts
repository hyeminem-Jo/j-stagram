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
  images: { id?: number; url: string }[];
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

export type PostsWithPagination = {
  posts: PostWithImages[] | null;
  page: number | null;
  pageSize: number | null;
  hasNextPage: boolean;
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

export async function getPosts(
  search: string = '',
  page: number = 1,
  pageSize: number = 10,
): Promise<PostsWithPagination> {
  const supabase = await createServerSupabaseClient();

  const {
    data: posts,
    count,
    error,
  } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      user_id,
      created_at,
      like_count,
      images (id, url)
    `,
      { count: 'exact' },
    ) // posts + 연결된 images 배열 가져오기
    .eq('is_public', true)
    .like('title', `%${search}%`)
    .order('created_at', { ascending: false }) // 최신순으로 불러오기
    .range((page - 1) * pageSize, page * pageSize - 1);

  const hasNextPage = count > page * pageSize;

  // if (error) handleError(error);
  if (error) {
    console.error(error);
    return {
      posts: [],
      page: null, // hasNextPage 계산을 위해 페이지 번호를 null로 설정
      // (hasNextPage 가 계속 true 로 유지되어 무한 스크롤 발생 이슈 해결)
      pageSize: null,
      hasNextPage: false,
    };
  }

  return {
    posts: await mapPostsWithUserInfo(posts),
    page, // 현재 페이지
    pageSize,
    hasNextPage,
  };
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
  const { id, ...updateData } = post;
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(); // 게시글 아이디와 일치하는 게시글 업데이트
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

// 이미지 URL이 다른 post_id에서도 사용되는지 확인
async function checkImageUsedInOtherPosts(
  supabase: any,
  imageUrl: string,
  excludePostId: number,
): Promise<boolean> {
  const { data: otherPosts, error: checkError } = await supabase
    .from('images')
    .select('post_id')
    .eq('url', imageUrl)
    .neq('post_id', excludePostId);

  if (checkError) {
    console.error('이미지 중복 확인 실패:', checkError);
    return false;
  }

  return (otherPosts?.length ?? 0) > 0;
}

// 다른 게시글에서 사용되지 않는 경우 Storage에서 이미지 삭제
async function deleteImageFromStorageIfNotUsed(
  supabase: any,
  imageUrl: string,
  excludePostId: number,
): Promise<void> {
  const isUsedInOtherPosts = await checkImageUsedInOtherPosts(supabase, imageUrl, excludePostId);

  // 다른 게시글에서 사용되지 않는 경우에만 Storage에서 삭제
  if (!isUsedInOtherPosts) {
    const filePath = extractFilePathFromUrl(imageUrl);
    if (filePath) {
      const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
      if (!bucket) {
        console.error('[deleteImageFromStorageIfNotUsed] STORAGE_BUCKET 환경 변수가 없습니다.');
        return;
      }

      const { error: storageError } = await supabase.storage.from(bucket).remove([filePath]);
      if (storageError) {
        console.error('Storage 파일 삭제 실패:', storageError);
        // Storage 삭제 실패해도 계속 진행
      }
    }
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
    // 2-1. 각 이미지 URL이 다른 post_id에서도 사용되는지 확인하고 Storage 삭제 대상 수집
    const imagesToDeleteFromStorage: string[] = [];

    for (const image of images) {
      const isUsedInOtherPosts = await checkImageUsedInOtherPosts(supabase, image.url, postId);

      // 다른 게시글에서 사용되지 않는 경우에만 Storage 삭제 대상에 추가
      if (!isUsedInOtherPosts) {
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
      const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
      if (!bucket) {
        console.error('[deletePost] STORAGE_BUCKET 환경 변수가 없습니다.');
      } else {
        const { error: storageError } = await supabase.storage
          .from(bucket)
          .remove(imagesToDeleteFromStorage);

        if (storageError) {
          console.error('Storage 파일 삭제 실패:', storageError);
          // Storage 삭제 실패해도 게시글은 삭제 진행
        }
      }
    }
  }

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
      images (id, url)
    `,
    )
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) handleError(error);

  return await mapPostsWithUserInfo(posts);
}

// 개별 게시글 가져오기
export async function getPostById(postId: number): Promise<PostWithImages | null> {
  const supabase = await createServerSupabaseClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      user_id,
      created_at,
      like_count,
      images (id, url)
    `,
    )
    .eq('id', postId)
    .eq('is_public', true)
    .maybeSingle();

  if (error) handleError(error);
  if (!post) return null;

  const posts = await mapPostsWithUserInfo([post]);
  return posts[0] || null;
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

// 이미지 삭제 (images 테이블에서 삭제, 다른 게시글에서 사용되지 않는 경우 Storage에서도 삭제)
export async function deleteImage(imageId: number) {
  const supabase = await createServerSupabaseClient();

  // 1. 삭제할 이미지 정보 가져오기
  const { data: imageData, error: fetchError } = await supabase
    .from('images')
    .select('id, url, post_id')
    .eq('id', imageId)
    .single();

  if (fetchError) handleError(fetchError);
  if (!imageData) return null;

  // 2. images 테이블에서 삭제
  const { data, error } = await supabase.from('images').delete().eq('id', imageId).select();
  if (error) handleError(error);

  // 3. 다른 게시글에서 사용되지 않는 경우에만 Storage에서 삭제
  await deleteImageFromStorageIfNotUsed(supabase, imageData.url, imageData.post_id);

  return data;
}
