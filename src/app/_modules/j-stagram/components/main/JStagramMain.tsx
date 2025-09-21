'use client';

import * as S from './styled';
import Button from '@/app/_modules/common/components/button/button/Button';
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
          {/* <S.JStagramHomeDesc>
            <S.JStagramHomeGreeting>
              Hello{' '}
              <S.JStagramHomeMyName>
                {myInfo?.user_metadata?.preferred_username ||
                  myInfo?.user_metadata?.name ||
                  myInfo?.email?.split('@')[0]}
              </S.JStagramHomeMyName>{' '}
              👋🏻
            </S.JStagramHomeGreeting>
            <span>J-stagram 에 방문하신 것을 환영합니다 &#58;&#41;</span>
          </S.JStagramHomeDesc>
          <Button text='로그아웃' filled onClick={handleLogout} /> */}
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
