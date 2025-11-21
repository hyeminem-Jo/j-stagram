'use client';

import * as S from './styled';
import { myInfoState, postSearchState } from '@/app/store';
import { useAtom } from 'jotai';
import Loading from '@/app/_modules/common/components/loading/Loading';
import JStagramFeedList from '../feed-list/JStagramFeedList';
import PostForm from '../post-form/PostForm';
import { useEffect } from 'react';

const JStagramMain = () => {
  const [myInfo] = useAtom(myInfoState);
  const [, setPostSearch] = useAtom(postSearchState);

  // 홈 페이지에서는 검색어를 초기화하여 전체 게시글을 보여줌
  useEffect(() => {
    setPostSearch('');
  }, [setPostSearch]);

  return (
    <S.JStagramMainContainer>
      {myInfo?.email ? (
        <>
          <PostForm />
          <JStagramFeedList />
        </>
      ) : (
        <Loading />
      )}
    </S.JStagramMainContainer>
  );
};

export default JStagramMain;
