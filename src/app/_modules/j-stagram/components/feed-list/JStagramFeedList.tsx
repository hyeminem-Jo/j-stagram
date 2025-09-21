'use client';

import * as S from './styled';
import Button from '@/app/_modules/common/components/button/button/Button';
import { myInfoState } from '@/app/store';
import { useAtom } from 'jotai';
import Loading from '@/app/_modules/common/components/loading/Loading';
import { createPost, getPosts, PostRow } from 'actions/postsActions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import JStagramFeed from '../feed/JStagramFeed';
import ControlledInput from '@/app/_modules/common/components/form/controlled-input/ControlledInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  searchInput: z.string().min(1, '검색어를 입력해주세요.'),
  postInput: z.string().min(1, '게시글을 입력해주세요.'),
});

const JStagramFeedList = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [myInfo] = useAtom(myInfoState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      searchInput: '',
      postInput: '',
    },
    mode: 'onChange',
  });

  const postsQuery = useQuery({
    queryKey: ['posts', searchInput],
    queryFn: () => getPosts({ searchInput }),
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const newPost = await createPost({
        title: '새 게시글 입니다으앙',
        content: '새 게시글 내용입니드아앙',
        is_public: true,
        user_id: myInfo.id,
      });
      return newPost;
    },
    onSuccess: (newPost) => {
      postsQuery.refetch();

      // ⬇️ 다른 페이지에서 쿼리 데이터 갱신시, queryClient 를 통해 캐시 데이터 갱신
      // queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    setSearchInput(data.searchInput);
    createPostMutation.mutate();
  };

  return (
    <S.JStagramFeedListContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <ControlledInput
          name='searchInput'
          control={control}
          placeholder='검색어를 입력하세요.'
          error={errors.searchInput}
        /> */}
        <ControlledInput
          name='postInput'
          control={control}
          placeholder='게시글을 입력하세요.'
          error={errors.postInput}
        />
      </form>

      {postsQuery.isLoading && <Loading />}
      {postsQuery.data &&
        postsQuery.data.map((post: PostRow) => <JStagramFeed key={post.id} post={post} />)}
      {postsQuery?.data && (
        <Button
          text='추가하기'
          iconName='plus'
          filled
          onClick={() => createPostMutation.mutate()}
          disabled={createPostMutation.isPending}
          loading={createPostMutation.isPending}
        />
      )}
    </S.JStagramFeedListContainer>
  );
};

export default JStagramFeedList;
