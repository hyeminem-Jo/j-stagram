'use client';

import * as S from './styled';
import Loading from '@/app/_modules/common/components/loading/Loading';
import { getPosts, PostWithImages } from 'actions/postsActions';
import { useQuery } from '@tanstack/react-query';
import JStagramFeed from '../feed/JStagramFeed';

const JStagramFeedList = () => {
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts({}),
  });

  return (
    <S.JStagramFeedListContainer>
      {postsQuery.isLoading && <Loading />}
      {postsQuery.data &&
        postsQuery.data.map((post: PostWithImages) => <JStagramFeed key={post.id} post={post} />)}
    </S.JStagramFeedListContainer>
  );
};

export default JStagramFeedList;
