'use client';

import * as S from './styled';
import { myInfoState } from '@/app/store';
import { useAtomValue } from 'jotai';
import DateUtil from '@/app/_modules/common/utils/dateUtil';
import UserProfileImage from '@/app/_modules/common/components/user-profile-image/UserProfileImage';
import { UserInfo } from 'actions/userActions';
import { MyInfo } from '@/app/types/commonType';
import { useQuery } from '@tanstack/react-query';
import { getPostsByUserId } from 'actions/postsActions';
import PostThumbnail from './PostThumbnail';
import { useIsMobile } from '@/app/_modules/common/hooks/useIsMobile';

const UserPage = ({ user }: { user: MyInfo | UserInfo }) => {
  const myInfo = useAtomValue(myInfoState);
  const isMobile = useIsMobile();
  const { data: userPosts = [], isLoading } = useQuery({
    queryKey: ['userPosts', user.id],
    queryFn: () => getPostsByUserId(user.id),
  });

  return (
    <S.UserPageContainer>
      <S.UserPageHeader>
        {!isMobile && <UserProfileImage user={user} size={160} />}
        <S.UserPageHeaderInner>
          {isMobile && <UserProfileImage user={user} size={90} />}
          <S.UserNameAndMessageButton>
            {(user?.user_metadata?.preferred_username ||
              user?.user_metadata?.name ||
              user?.email) && (
              <S.UserInfoName>
                {user?.user_metadata?.preferred_username ||
                  user?.user_metadata?.name ||
                  user?.email?.split('@')[0]}
              </S.UserInfoName>
            )}
            {/* 내 프로필이 아닌 경우에만 메세지 보내기 버튼 표시 */}
            {myInfo.id && user.id && myInfo.id !== user.id && (
              <S.MessageButton href={`/j-stagram/message?userId=${user.id}`}>
                메세지 보내기
              </S.MessageButton>
            )}
          </S.UserNameAndMessageButton>
          <S.UserInfo>
            <S.UserInfoItem>
              <S.UserInfoItemTitle>Email </S.UserInfoItemTitle>
              <S.UserInfoItemValue>{user?.email}</S.UserInfoItemValue>
            </S.UserInfoItem>
            <S.UserInfoItem>
              <S.UserInfoItemTitle>생성일 </S.UserInfoItemTitle>
              <S.UserInfoItemValue>{DateUtil.format(user?.created_at)}</S.UserInfoItemValue>
            </S.UserInfoItem>
            <S.UserInfoItem>
              <S.UserInfoItemTitle>마지막 접속일 </S.UserInfoItemTitle>
              <S.UserInfoItemValue>{DateUtil.format(user?.last_sign_in_at)}</S.UserInfoItemValue>
            </S.UserInfoItem>
          </S.UserInfo>
        </S.UserPageHeaderInner>
      </S.UserPageHeader>

      <S.UserPostsSection>
        <S.UserPostsTitle>Posts ({userPosts.length})</S.UserPostsTitle>
        {isLoading ? (
          <S.EmptyPostsMessage>게시물을 불러오는 중...✨</S.EmptyPostsMessage>
        ) : userPosts.length > 0 ? (
          <S.PostsGrid>
            {userPosts.map((post) => (
              <PostThumbnail key={post.id} post={post} />
            ))}
          </S.PostsGrid>
        ) : (
          <S.EmptyPostsMessage>아직 게시물이 없습니다. 🙁</S.EmptyPostsMessage>
        )}
      </S.UserPostsSection>
    </S.UserPageContainer>
  );
};

export default UserPage;
