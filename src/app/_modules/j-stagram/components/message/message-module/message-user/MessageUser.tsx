'use client';

import DateUtil from '@/app/_modules/common/utils/dateUtil';

import * as S from './styled';
import UserProfileImage from '@/app/_modules/common/components/user-profile-image/UserProfileImage';

import { MyInfo } from '@/app/types/commonType';

interface MessageUserProps {
  user: MyInfo;
  onlineAt?: string;
  isChat?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const MessageUser = ({ user, onlineAt, isChat, active, onClick }: MessageUserProps) => {
  return (
    <S.MessageUserContainer $active={active} $isChat={isChat} onClick={onClick}>
      <S.MessageUserImageWrap $isOnline={!!onlineAt} isChat={isChat}>
        <UserProfileImage user={user} size={40} mobileSize={!isChat ? 45 : 40} />
      </S.MessageUserImageWrap>
      <S.MessageUserInfo $isChat={isChat}>
        <S.MessageUserName>
          {user.user_metadata?.preferred_username ||
            user.user_metadata?.name ||
            user.email?.split('@')[0]}
        </S.MessageUserName>
        {onlineAt && (
          <S.MessageUserOnlineAt>
            {isChat && '최근 접속:'} {DateUtil.renderDateSnsType(onlineAt)}
          </S.MessageUserOnlineAt>
        )}
      </S.MessageUserInfo>
    </S.MessageUserContainer>
  );
};

export default MessageUser;
