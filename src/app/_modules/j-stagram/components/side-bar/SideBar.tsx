'use client';

import * as S from './styled';
import Image from 'next/image';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useAtomValue } from 'jotai';
import { myInfoState } from '@/app/store';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const supabase = createBrowserSupabaseClient();
  const myInfo = useAtomValue(myInfoState);
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await supabase.auth.signOut();
    }
  };

  return (
    <S.SideBarContainer>
      <S.SideBarHomeLink href='/j-stagram' />
      <S.SideBarContent>
        <S.SideBarLink href='/j-stagram' $isActive={pathname === '/j-stagram'}>
          <i className='fa-solid fa-house'></i>
        </S.SideBarLink>
        <S.SideBarLink href='/j-stagram/search' $isActive={pathname === '/j-stagram/search'}>
          <i className='fa-solid fa-magnifying-glass'></i>
        </S.SideBarLink>
        <S.SideBarLink href='/j-stagram/message' $isActive={pathname === '/j-stagram/message'}>
          <i className='fa-solid fa-paper-plane'></i>
        </S.SideBarLink>
        <S.SideBarProfileLink
          href={`/j-stagram/${myInfo?.id}`}
          $hasImage={!!myInfo?.user_metadata?.avatar_url}
          $isActive={pathname === `/j-stagram/${myInfo?.id}`}
        >
          {myInfo?.user_metadata?.avatar_url ? (
            <Image
              src={myInfo?.user_metadata?.avatar_url}
              alt='내 프로필 이미지'
              fill
              priority
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <i className='fa-solid fa-user' />
          )}
        </S.SideBarProfileLink>
      </S.SideBarContent>
      <S.SideBarLogoutButton type='button' onClick={handleLogout} aria-label='로그아웃'>
        <i className='fa-solid fa-right-from-bracket'></i>
      </S.SideBarLogoutButton>
    </S.SideBarContainer>
  );
};

export default SideBar;
