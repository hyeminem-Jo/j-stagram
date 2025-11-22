'use client';

import * as S from './styled';
import Button from '@/app/_modules/common/components/button/button/Button';
import { myInfoState } from '@/app/store';
import { useAtom } from 'jotai';
import {
  createPost,
  createPostImages,
  PostWithImages,
  updatePost,
  deleteImage,
} from 'actions/postsActions';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ControlledTextarea from '@/app/_modules/common/components/form/controlled-textarea/ControlledTextarea';
import ControlledInput from '@/app/_modules/common/components/form/controlled-input/ControlledInput';
import { getImageUrl } from 'utils/supabase/storage';
import { useState, useRef, useEffect, useMemo } from 'react';
import { queryClient } from '@/app/config/ReactQueryProvider';

const schema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  postInput: z.string().min(1, '게시글을 입력해주세요.'),
});

interface PostFormProps {
  createMode?: boolean;
  editMode?: boolean;
  post?: PostWithImages;
  onCancel?: () => void;
  onSuccess?: (postId?: number) => void;
  onPendingChange?: (isPending: boolean) => void;
}

const PostForm = ({
  createMode = false,
  editMode = false,
  post,
  onCancel,
  onSuccess,
  onPendingChange,
}: PostFormProps) => {
  const [myInfo] = useAtom(myInfoState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState(post?.images || []);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]); // 삭제할 이미지 ID 목록
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: editMode && post ? post.title : '',
      postInput: editMode && post ? post.content : '',
    },
    mode: 'onChange',
  });

  // editMode일 때 초기값 설정
  useEffect(() => {
    if (editMode && post) {
      reset({
        title: post.title || '',
        postInput: post.content || '',
      });
      setCurrentImages(post.images || []);
      setDeletedImageIds([]); // 취소 시 초기화
    }
  }, [editMode, post, reset]);

  // 썸네일 URL 생성 및 관리 (메모리 누수 방지)
  const thumbnailUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  // 썸네일 URL cleanup (메모리 해제)
  useEffect(() => {
    return () => {
      thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbnailUrls]);

  // API Route로 파일 업로드
  const handleUpload = async (formData: FormData) => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // 응답이 JSON인지 확인
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('서버에서 올바르지 않은 응답을 받았습니다. 잠시 후 다시 시도해주세요.');
      }

      const result = await res.json();

      if (!res.ok) {
        const errorMessage = result.error || `업로드 실패 (상태 코드: ${res.status})`;
        const errorCode = result.code || 'UNKNOWN_ERROR';
        console.error('Upload error:', { errorMessage, errorCode, result });
        throw new Error(errorMessage);
      }

      return result;
    } catch (error) {
      console.error('Upload fetch error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('파일 업로드 중 알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // 파일 유효성 검사
      const validFiles: File[] = [];
      const errors: string[] = [];

      newFiles.forEach((file) => {
        // 파일 크기 검사 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name}: 파일 크기가 5MB를 초과합니다.`);
          return;
        }

        // 파일 타입 검사
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: 이미지 파일만 업로드 가능합니다.`);
          return;
        }

        validFiles.push(file);
      });

      // 에러가 있으면 사용자에게 알림
      if (errors.length > 0) {
        alert(errors.join('\n'));
      }

      // 유효한 파일만 추가
      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }

      // input 초기화
      e.target.value = '';
    }
  };

  // 이미지 삭제 (UI에서만 제거, 실제 삭제는 저장 시 실행)
  const handleDeleteImage = (imageId: number | undefined, imageUrl: string) => {
    if (!imageId) {
      // 새로 추가한 이미지인 경우 (아직 DB에 저장되지 않음)
      const index = thumbnailUrls.findIndex((url) => url === imageUrl);
      if (index !== -1) {
        // URL 해제
        URL.revokeObjectURL(thumbnailUrls[index]);
        // 파일 제거
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
      }
      return;
    }
    // 기존 이미지인 경우: 삭제 목록에 추가하고 UI에서만 제거
    setDeletedImageIds((prev) => [...prev, imageId]);
    setCurrentImages(currentImages.filter((img) => img.id !== imageId));
  };

  const createPostMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof schema>) => {
      let imageUrls: string[] = [];

      // 파일이 선택된 경우 업로드
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          const uploadFormData = new FormData();
          // 서버에서 고유한 파일명을 생성하므로 원본 파일명 사용
          selectedFiles.forEach((file) => {
            uploadFormData.append('file', file);
          });

          const uploadResult = await handleUpload(uploadFormData);
          if (uploadResult.result && Array.isArray(uploadResult.result)) {
            imageUrls = uploadResult.result
              .map((item: { data?: { path?: string } }) => {
                if (item.data?.path) {
                  return getImageUrl(item.data.path);
                }
                return null;
              })
              .filter((url: string | null) => url !== null);
          }
        } catch (err) {
          throw new Error((err as Error).message);
        } finally {
          setIsUploading(false);
        }
      }

      // 게시글 생성
      const newPost = await createPost({
        title: formData.title,
        content: formData.postInput,
        is_public: true,
        user_id: myInfo.id,
      });

      // 이미지가 있으면 images 테이블에 추가
      if (imageUrls.length > 0 && newPost.id) {
        await createPostImages(newPost.id, imageUrls);
      }

      return newPost;
    },
    onSuccess: (newPost) => {
      setIsUploading(false); // 업로드 상태 초기화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      reset();
      // 썸네일 URL 해제
      thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // 새로 생성된 게시글 ID 전달 (newPost가 있고 id가 있는 경우에만)
      if (newPost?.id) {
        onSuccess?.(newPost.id);
      }
    },
    onError: (error: Error) => {
      setIsUploading(false); // 에러 발생 시에도 업로드 상태 초기화
      // 업로드 실패 시 썸네일 URL 해제 및 상태 롤백
      thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert(error.message);
    },
    onSettled: () => {
      // mutation 완료 시 (성공/실패 관계없이) 로딩 상태 false로 설정
      onPendingChange?.(false);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof schema>) => {
      if (!post) throw new Error('게시글 정보가 없습니다.');

      let newImageUrls: string[] = [];

      // 새 파일이 선택된 경우 업로드
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          const uploadFormData = new FormData();
          // 서버에서 고유한 파일명을 생성하므로 원본 파일명 사용
          selectedFiles.forEach((file) => {
            uploadFormData.append('file', file);
          });

          const uploadResult = await handleUpload(uploadFormData);
          if (uploadResult.result && Array.isArray(uploadResult.result)) {
            newImageUrls = uploadResult.result
              .map((item: { data?: { path?: string } }) => {
                if (item.data?.path) {
                  return getImageUrl(item.data.path);
                }
                return null;
              })
              .filter((url: string | null) => url !== null);
          }
        } catch (err) {
          throw new Error((err as Error).message);
        } finally {
          setIsUploading(false);
        }
      }

      // 삭제할 이미지들 삭제
      if (deletedImageIds.length > 0) {
        await Promise.all(deletedImageIds.map((imageId) => deleteImage(imageId)));
      }

      // 게시글 업데이트
      await updatePost({
        id: post.id,
        title: formData.title,
        content: formData.postInput,
      });

      // 새 이미지 추가
      if (newImageUrls.length > 0) {
        await createPostImages(post.id, newImageUrls);
      }

      return { success: true };
    },
    onSuccess: () => {
      setIsUploading(false); // 업로드 상태 초기화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      if (post?.id) {
        queryClient.invalidateQueries({ queryKey: ['post', post.id] });
      }
      reset();
      // 썸네일 URL 해제
      thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setDeletedImageIds([]); // 삭제 목록 초기화
      setCurrentImages(post?.images || []);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSuccess?.(post?.id);
    },
    onError: (error: Error) => {
      setIsUploading(false); // 에러 발생 시에도 업로드 상태 초기화
      // 업로드 실패 시 썸네일 URL 해제 및 상태 롤백
      thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert(error.message);
    },
    onSettled: () => {
      // mutation 완료 시 (성공/실패 관계없이) 로딩 상태 false로 설정
      onPendingChange?.(false);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (editMode) {
      if (updatePostMutation.isPending || isUploading) return;
      updatePostMutation.mutate(data);
    } else {
      if (createPostMutation.isPending || isUploading) return;
      createPostMutation.mutate(data);
    }
  };

  const isLoading = editMode
    ? updatePostMutation.isPending || isUploading
    : createPostMutation.isPending || isUploading;

  // isPending 상태 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onPendingChange?.(isLoading);
  }, [isLoading, onPendingChange]);

  return (
    <S.StyledPostForm
      onSubmit={handleSubmit(onSubmit)}
      $isEditMode={editMode}
      $isCreateMode={createMode}
    >
      <ControlledInput
        name='title'
        control={control}
        placeholder='제목을 입력해주세요'
        error={errors.title}
        maxLength={50}
      />
      <ControlledTextarea
        name='postInput'
        rows={4}
        control={control}
        placeholder='오늘은 어떤 일이 있었나요? :)'
        error={errors.postInput}
        maxLength={500}
      />

      {/* 이미지 썸네일 */}
      {(currentImages.length > 0 || selectedFiles.length > 0) && (
        <S.ImageThumbnailsContainer>
          {/* 기존 이미지 (수정 모드일 때만) */}
          {editMode &&
            currentImages.map((image, index) => (
              <S.ImageThumbnail key={image.id || `existing-${index}`}>
                <S.ThumbnailImage src={image.url} alt='썸네일' />
                <S.ThumbnailDeleteButton
                  type='button'
                  onClick={() => handleDeleteImage(image.id, image.url)}
                  aria-label='이미지 삭제'
                >
                  <i className='fa-solid fa-xmark'></i>
                </S.ThumbnailDeleteButton>
              </S.ImageThumbnail>
            ))}
          {/* 새로 선택한 이미지 */}
          {selectedFiles.map((file, index) => (
            <S.ImageThumbnail key={`new-${index}`}>
              <S.ThumbnailImage src={thumbnailUrls[index]} alt='새 이미지' />
              <S.ThumbnailDeleteButton
                type='button'
                onClick={() => {
                  // URL 해제
                  URL.revokeObjectURL(thumbnailUrls[index]);
                  // 파일 제거
                  setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                }}
                aria-label='이미지 제거'
              >
                <i className='fa-solid fa-xmark'></i>
              </S.ThumbnailDeleteButton>
            </S.ImageThumbnail>
          ))}
        </S.ImageThumbnailsContainer>
      )}

      <S.FileInputWrapper>
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='image/*'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Button
          type='button'
          text='이미지 선택'
          bgColor='#ddd'
          iconName='plus'
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        />
        {editMode ? (
          <S.EditButtonsContainer>
            <S.EditButton
              type='button'
              $variant='cancel'
              onClick={() => {
                // 취소 시 삭제 목록 초기화 및 원래 이미지 복원
                setDeletedImageIds([]);
                setSelectedFiles([]);
                setCurrentImages(post?.images || []);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                onCancel?.();
              }}
              disabled={isLoading}
            >
              취소
            </S.EditButton>
            <S.EditButton type='submit' $variant='save' disabled={isLoading}>
              {isLoading ? '저장 중...' : '저장'}
            </S.EditButton>
          </S.EditButtonsContainer>
        ) : (
          <Button
            type='submit'
            text='공유하기  '
            iconName='plus'
            filled
            disabled={isLoading}
            loading={isLoading}
          />
        )}
      </S.FileInputWrapper>
    </S.StyledPostForm>
  );
};

export default PostForm;
