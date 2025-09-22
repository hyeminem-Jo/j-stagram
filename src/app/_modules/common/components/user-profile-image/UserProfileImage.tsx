'use client';

import { MyInfo } from '@/app/types/commonType';
import * as S from './styled';
import Image from 'next/image';
import { UserInfo } from 'actions/userActions';

interface UserProfileImageProps {
  user: MyInfo | UserInfo;
  size?: number;
  mobileSize?: number;
}

const UserProfileImage = ({ user, size = 30, mobileSize }: UserProfileImageProps) => {
  return (
    <S.ProfileImage
      href={`/j-stagram/${user?.id}`}
      $hasImage={!!user?.user_metadata?.avatar_url}
      $size={size / 10}
      $mobileSize={mobileSize / 10 || size / 10}
    >
      {user?.user_metadata?.avatar_url ? (
        <Image
          src={user?.user_metadata?.avatar_url}
          alt='프로필 이미지'
          fill
          priority
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      ) : (
        <i className='fa-solid fa-user' />
      )}
    </S.ProfileImage>
  );
};

export default UserProfileImage;
