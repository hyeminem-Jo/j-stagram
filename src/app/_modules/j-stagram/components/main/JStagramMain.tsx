'use client';

import * as S from './styled';
import { myInfoState } from '@/app/store';
import { useAtom } from 'jotai';
import Loading from '@/app/_modules/common/components/loading/Loading';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import JStagramFeedList from '../feed-list/JStagramFeedList';
import PostForm from '../post-form/PostForm';

const JStagramMain = () => {
  const [myInfo] = useAtom(myInfoState);
  const supabase = createBrowserSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
