'use client';

import * as S from './styled';
import { myInfoState, postSearchState } from '@/app/store';
import { useAtom } from 'jotai';
import Loading from '@/app/_modules/common/components/loading/Loading';
import JStagramFeedList from '../feed-list/JStagramFeedList';
import PostForm from '../post-form/PostForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const JStagramMain = () => {
  const [myInfo] = useAtom(myInfoState);
  const [, setPostSearch] = useAtom(postSearchState);
  const router = useRouter();

  // 홈 페이지에서는 검색어를 초기화하여 전체 게시글을 보여줌
  useEffect(() => {
    setPostSearch('');
  }, [setPostSearch]);

  // 나만보기 게시글 등록 시 프로필 페이지로 이동
  const handlePostCreated = (postId?: number, isPublic?: boolean) => {
    if (postId && isPublic === false && myInfo?.id) {
      // 나만보기 게시글인 경우 프로필 페이지로 이동 후 모달 열기
      router.push(`/j-stagram/${myInfo.id}?postId=${postId}`);
    }
  };

  return (
    <S.JStagramMainContainer>
      {myInfo?.email ? (
        <>
          <PostForm onSuccess={handlePostCreated} />
          <JStagramFeedList />
        </>
      ) : (
        <Loading />
      )}
    </S.JStagramMainContainer>
  );
};

export default JStagramMain;
