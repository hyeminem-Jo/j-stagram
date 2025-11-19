'use client';

import * as S from './styled';
import Button from '@/app/_modules/common/components/button/button/Button';
import { myInfoState } from '@/app/store';
import { useAtom } from 'jotai';
import { createPost, createPostImages, getPosts, PostWithImages } from 'actions/postsActions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateUtil from '@/app/_modules/common/utils/dateUtil';
import ControlledTextarea from '@/app/_modules/common/components/form/controlled-textarea/ControlledTextarea';
import ControlledInput from '@/app/_modules/common/components/form/controlled-input/ControlledInput';
import { getImageUrl } from 'utils/supabase/storage';
import { toSafeFileName } from 'utils/fileUtil';
import { useState, useRef } from 'react';

const schema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  postInput: z.string().min(1, '게시글을 입력해주세요.'),
});

const JStagramFeedList = () => {
  const [myInfo] = useAtom(myInfoState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
      title: '',
      postInput: '',
    },
    mode: 'onChange',
  });

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts({}),
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
      setSelectedFiles(Array.from(e.target.files));
    }
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
          // uploadResult.result는 [{ data: { path: string } }] 형태
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
      postsQuery.refetch();
      reset();
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    // 중복 제출 방지
    if (createPostMutation.isPending || isUploading) {
      return;
    }
    console.log(data);
    createPostMutation.mutate(data);
  };

  return (
    <S.StyledPostForm onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput
        name='title'
        control={control}
        placeholder='제목을 입력해주세요'
        error={errors.title}
      />
      <ControlledTextarea
        name='postInput'
        rows={4}
        control={control}
        placeholder='오늘은 어떤 일이 있었나요? :)'
        error={errors.postInput}
      />
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
          disabled={isUploading || createPostMutation.isPending}
        />
        {selectedFiles.length > 0 && (
          <S.SelectedFilesInfo>{selectedFiles.length}개의 파일 선택</S.SelectedFilesInfo>
        )}
        <Button
          type='submit'
          text='공유하기  '
          iconName='plus'
          filled
          disabled={createPostMutation.isPending || isUploading}
          loading={createPostMutation.isPending || isUploading}
        />
      </S.FileInputWrapper>
    </S.StyledPostForm>
  );
};

export default JStagramFeedList;
