'use client';

import * as S from './styled';
import Button from '@/app/_modules/common/components/button/button/Button';
import { myInfoState } from '@/app/store';
import { useAtom } from 'jotai';
import {
  createPost,
  createPostImages,
  getPosts,
  PostWithImages,
  updatePost,
  deleteImage,
} from 'actions/postsActions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ControlledTextarea from '@/app/_modules/common/components/form/controlled-textarea/ControlledTextarea';
import ControlledInput from '@/app/_modules/common/components/form/controlled-input/ControlledInput';
import { getImageUrl } from 'utils/supabase/storage';
import { toSafeFileName } from 'utils/fileUtil';
import { useState, useRef, useEffect } from 'react';
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

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts({}),
    enabled: !editMode, // 수정 모드일 때는 쿼리 비활성화
  });

  // API Route로 파일 업로드
  const handleUpload = async (formData: FormData) => {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Upload failed');
    return result;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  // 이미지 삭제 (UI에서만 제거, 실제 삭제는 저장 시 실행)
  const handleDeleteImage = (imageId: number | undefined, imageUrl: string) => {
    if (!imageId) {
      // 새로 추가한 이미지인 경우 (아직 DB에 저장되지 않음)
      setCurrentImages(currentImages.filter((img) => img.url !== imageUrl));
      setSelectedFiles(
        selectedFiles.filter((_, index) => {
          const fileUrl = URL.createObjectURL(selectedFiles[index]);
          return fileUrl !== imageUrl;
        }),
      );
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
          selectedFiles.forEach((file) => {
            const safeName = toSafeFileName(file.name);
            const safeFile = new File([file], safeName, { type: file.type });
            uploadFormData.append('file', safeFile);
          });

          const uploadResult = await handleUpload(uploadFormData);
          if (uploadResult.result && Array.isArray(uploadResult.result)) {
            imageUrls = uploadResult.result
              .map((item: any) => {
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
          selectedFiles.forEach((file) => {
            const safeName = toSafeFileName(file.name);
            const safeFile = new File([file], safeName, { type: file.type });
            uploadFormData.append('file', safeFile);
          });

          const uploadResult = await handleUpload(uploadFormData);
          if (uploadResult.result && Array.isArray(uploadResult.result)) {
            newImageUrls = uploadResult.result
              .map((item: any) => {
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
              <S.ThumbnailImage src={URL.createObjectURL(file)} alt='새 이미지' />
              <S.ThumbnailDeleteButton
                type='button'
                onClick={() => {
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
