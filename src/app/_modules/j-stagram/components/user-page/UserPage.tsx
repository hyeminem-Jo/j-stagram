'use client';

import * as S from './styled';
import { myInfoState } from '@/app/store';
import { useAtomValue } from 'jotai';
import DateUtil from '@/app/_modules/common/utils/dateUtil';
import UserProfileImage from '@/app/_modules/common/components/user-profile-image/UserProfileImage';
import { UserInfo } from 'actions/userActions';
import { MyInfo } from '@/app/types/commonType';

const UserPage = ({ user }: { user: MyInfo | UserInfo }) => {
  const myInfo = useAtomValue(myInfoState);

  return (
    <S.UserPageContainer>
      <UserProfileImage user={user} size={300} mobileSize={200} />
      <div>
        <S.UserPageTitle>User Info</S.UserPageTitle>
        <S.UserPageTitle>_</S.UserPageTitle>
        <S.JStagramMyInfoList>
          {(user?.user_metadata?.preferred_username ||
            user?.user_metadata?.name ||
            user?.email) && (
            <S.JStagramMyInfoItem>
              <S.JStagramMyInfoItemTitle>Name: </S.JStagramMyInfoItemTitle>
              <S.JStagramMyInfoItemValue>
                {user?.user_metadata?.preferred_username ||
                  user?.user_metadata?.name ||
                  user?.email?.split('@')[0]}
              </S.JStagramMyInfoItemValue>
            </S.JStagramMyInfoItem>
          )}
          <S.JStagramMyInfoItem>
            <S.JStagramMyInfoItemTitle>Email: </S.JStagramMyInfoItemTitle>
            <S.JStagramMyInfoItemValue>{user?.email}</S.JStagramMyInfoItemValue>
          </S.JStagramMyInfoItem>
          <S.JStagramMyInfoItem>
            <S.JStagramMyInfoItemTitle>Created At: </S.JStagramMyInfoItemTitle>
            <S.JStagramMyInfoItemValue>
              {DateUtil.format(user?.created_at)}
            </S.JStagramMyInfoItemValue>
          </S.JStagramMyInfoItem>
          <S.JStagramMyInfoItem>
            <S.JStagramMyInfoItemTitle>Last Sign In At: </S.JStagramMyInfoItemTitle>
            <S.JStagramMyInfoItemValue>
              {DateUtil.format(user?.last_sign_in_at)}
            </S.JStagramMyInfoItemValue>
          </S.JStagramMyInfoItem>
        </S.JStagramMyInfoList>
      </div>
    </S.UserPageContainer>
  );
};

export default UserPage;
