'use client';

import * as S from './styled';
import Button from '@/app/_modules/common/components/button/button/Button';
import { myInfoState } from '@/app/store';
import { useAtom } from 'jotai';
import Loading from '@/app/_modules/common/components/loading/Loading';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { createPost, getPosts, PostRow } from 'actions/postsActions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const JStagramFeed = ({ post }: { post: PostRow }) => {
  const [searchInput, setSearchInput] = useState<string>('');

  const postsQuery = useQuery({
    queryKey: ['posts', searchInput],
    queryFn: () => getPosts({ searchInput }),
  });

  return <S.JStagramFeedContainer>{JSON.stringify(post)}</S.JStagramFeedContainer>;
  // return <S.JStagramFeedContainer>{post.title}</S.JStagramFeedContainer>;
};

export default JStagramFeed;
