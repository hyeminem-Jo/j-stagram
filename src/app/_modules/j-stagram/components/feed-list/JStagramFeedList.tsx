'use client';

import * as S from './styled';
import Loading from '@/app/_modules/common/components/loading/Loading';
import { getPosts, PostWithImages } from 'actions/postsActions';
import JStagramFeed from '../feed/JStagramFeed';
import { useAtomValue } from 'jotai';
import { postSearchState } from '@/app/store';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

const JStagramFeedList = () => {
  const postSearch = useAtomValue(postSearchState);
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['posts', postSearch],
    queryFn: ({ pageParam }) => getPosts(postSearch, pageParam, 5),
    getNextPageParam: (lastPage) => {
      return lastPage.page ? lastPage.page + 1 : null;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 리페치 방지
    refetchOnMount: false, // 마운트 시 리페치 방지
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <S.JStagramFeedListContainer>
      {(isFetching || isFetchingNextPage) && <Loading />}
      {data && (
        <>
          {data.pages.map((page, pageIndex) =>
            page.posts.map((post: PostWithImages) => (
              <JStagramFeed key={`${pageIndex}-${post.id}`} post={post} />
            )),
          )}
          <div ref={ref} />
        </>
      )}
    </S.JStagramFeedListContainer>
  );
};

export default JStagramFeedList;
