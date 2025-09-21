'use client';

import * as S from './styled';
import Button from '@/app/_modules/common/components/button/button/Button';
import { myInfoState } from '@/app/store';
import { useAtom } from 'jotai';
import Loading from '@/app/_modules/common/components/loading/Loading';
import { createPost, getPosts, PostWithImages } from 'actions/postsActions';
import { useMutation, useQuery } from '@tanstack/react-query';
import ControlledInput from '@/app/_modules/common/components/form/controlled-input/ControlledInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateUtil from '@/app/_modules/common/utils/dateUtil';

const schema = z.object({
  postInput: z.string().min(1, '게시글을 입력해주세요.'),
});

const JStagramFeedList = () => {
  const [myInfo] = useAtom(myInfoState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      postInput: '',
    },
    mode: 'onChange',
  });

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts({}),
  });

  const createPostMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof schema>) => {
      const newPost = await createPost({
        title: `게시글 ${DateUtil.format(new Date().toISOString())}`,
        content: formData.postInput,
        is_public: true,
        user_id: myInfo.id,
      });
      return newPost;
    },
    onSuccess: (newPost) => {
      postsQuery.refetch();
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
    createPostMutation.mutate(data);
  };

  return (
    <S.StyledPostForm onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput
        name='postInput'
        control={control}
        placeholder='게시글을 입력하세요.'
        error={errors.postInput}
      />
      <Button
        type='submit'
        text='공유하기  '
        iconName='plus'
        filled
        disabled={createPostMutation.isPending}
        loading={createPostMutation.isPending}
      />
    </S.StyledPostForm>
  );
};

export default JStagramFeedList;
