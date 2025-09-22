'use client';

import * as S from './styled';
import { myInfoState } from '@/app/store';
import { useAtomValue } from 'jotai';
import DateUtil from '@/app/_modules/common/utils/dateUtil';
import UserProfileImage from '@/app/_modules/common/components/user-profile-image/UserProfileImage';

const UserPage = () => {
  const myInfo = useAtomValue(myInfoState);

  return (
    <S.UserPageContainer>
      <UserProfileImage user={myInfo} size={300} mobileSize={200} />
      <div>
        <S.UserPageTitle>User Info</S.UserPageTitle>
        <S.UserPageTitle>_</S.UserPageTitle>
        <S.JStagramMyInfoList>
          {(myInfo?.user_metadata?.preferred_username ||
            myInfo?.user_metadata?.name ||
            myInfo?.email) && (
            <S.JStagramMyInfoItem>
              <S.JStagramMyInfoItemTitle>Name: </S.JStagramMyInfoItemTitle>
              <S.JStagramMyInfoItemValue>
                {myInfo?.user_metadata?.preferred_username ||
                  myInfo?.user_metadata?.name ||
                  myInfo?.email?.split('@')[0]}
              </S.JStagramMyInfoItemValue>
            </S.JStagramMyInfoItem>
          )}
          <S.JStagramMyInfoItem>
            <S.JStagramMyInfoItemTitle>Email: </S.JStagramMyInfoItemTitle>
            <S.JStagramMyInfoItemValue>{myInfo?.email}</S.JStagramMyInfoItemValue>
          </S.JStagramMyInfoItem>
          <S.JStagramMyInfoItem>
            <S.JStagramMyInfoItemTitle>Created At: </S.JStagramMyInfoItemTitle>
            <S.JStagramMyInfoItemValue>
              {DateUtil.format(myInfo?.created_at)}
            </S.JStagramMyInfoItemValue>
          </S.JStagramMyInfoItem>
          <S.JStagramMyInfoItem>
            <S.JStagramMyInfoItemTitle>Last Sign In At: </S.JStagramMyInfoItemTitle>
            <S.JStagramMyInfoItemValue>
              {DateUtil.format(myInfo?.last_sign_in_at)}
            </S.JStagramMyInfoItemValue>
          </S.JStagramMyInfoItem>
        </S.JStagramMyInfoList>
      </div>
    </S.UserPageContainer>
  );
};

export default UserPage;
