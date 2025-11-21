'use client';

import * as S from './styled';
import { useForm } from 'react-hook-form';
import ControlledInput from '@/app/_modules/common/components/form/controlled-input/ControlledInput';
import JStagramFeedList from '../feed-list/JStagramFeedList';
import { useAtom } from 'jotai';
import { postSearchState } from '@/app/store';
import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from 'actions/postsActions';

interface SearchForm {
  searchTerm: string;
}

const JStagramSearch = () => {
  const [postSearch, setPostSearch] = useAtom(postSearchState);
  const { control, watch } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: postSearch,
    },
  });

  const searchTerm = watch('searchTerm');

  // 검색 결과 확인을 위한 쿼리
  const { data: searchData, isFetching } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['posts', postSearch],
    queryFn: ({ pageParam }) => getPosts(postSearch, pageParam, 5),
    getNextPageParam: (lastPage) => {
      return lastPage.page ? lastPage.page + 1 : null;
    },
    enabled: !!postSearch, // 검색어가 있을 때만 실행
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPostSearch(searchTerm || '');
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, setPostSearch]);

  // 검색 결과가 있는지 확인
  const hasSearchResults = searchData?.pages?.[0]?.posts?.length > 0;

  return (
    <S.JStagramSearchContainer>
      <S.JStagramSearchHeader>
        <S.JStagramSearchTitle>게시글 검색 🔍</S.JStagramSearchTitle>
        <S.JStagramSearchInputWrapper>
          <ControlledInput
            name='searchTerm'
            control={control}
            placeholder='제목 혹은 내용을 검색해보세요:)'
          />
        </S.JStagramSearchInputWrapper>
      </S.JStagramSearchHeader>
      <S.JStagramSearchContent>
        {!postSearch ? (
          <S.JStagramSearchEmptyState>
            <p>검색어를 입력해주세요 🤔</p>
          </S.JStagramSearchEmptyState>
        ) : isFetching ? (
          <JStagramFeedList />
        ) : hasSearchResults ? (
          <JStagramFeedList />
        ) : (
          <S.JStagramSearchEmptyState>
            <p>검색어에 해당하는 게시글이 없습니다 🙁</p>
          </S.JStagramSearchEmptyState>
        )}
      </S.JStagramSearchContent>
    </S.JStagramSearchContainer>
  );
};

export default JStagramSearch;
