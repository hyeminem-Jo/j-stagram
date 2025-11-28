'use client';

import { useState, useMemo } from 'react';
import * as S from './styled';
import { myInfoState } from '@/app/store';
import { useAtomValue } from 'jotai';
import DateUtil from '@/app/_modules/common/utils/dateUtil';
import UserProfileImage from '@/app/_modules/common/components/user-profile-image/UserProfileImage';
import { UserInfo } from 'actions/userActions';
import { MyInfo } from '@/app/types/commonType';
import { useQuery } from '@tanstack/react-query';
import { getPostsByUserId, getPostById } from 'actions/postsActions';
import PostThumbnail from './PostThumbnail';
import { useIsMobile } from '@/app/_modules/common/hooks/useIsMobile';
import PostForm from '@/app/_modules/j-stagram/components/post-form/PostForm';
import JStagramFeed from '@/app/_modules/j-stagram/components/feed/JStagramFeed';
import { queryClient } from '@/app/config/ReactQueryProvider';
import PostModal from './PostModal';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

const UserPage = ({ user }: { user: MyInfo | UserInfo }) => {
  const myInfo = useAtomValue(myInfoState);
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalPending, setIsModalPending] = useState(false);
  const supabase = createBrowserSupabaseClient();

  // 사용자 표시 이름 가져오기
  const getUserDisplayName = useMemo(() => {
    return (
      user?.user_metadata?.preferred_username ||
      user?.user_metadata?.name ||
      user?.email?.split('@')[0]
    );
  }, [user]);

  // 사용자 이름이 있는지 확인
  const hasUserName = useMemo(() => {
    return !!(user?.user_metadata?.preferred_username || user?.user_metadata?.name || user?.email);
  }, [user]);

  const { data: userPosts = [], isLoading } = useQuery({
    queryKey: ['userPosts', user.id],
    queryFn: () => getPostsByUserId(user.id),
  });

  // 모달에서 선택된 게시글 데이터 가져오기
  const { data: selectedPost, isLoading: isLoadingSelectedPost } = useQuery({
    queryKey: ['post', selectedPostId],
    queryFn: () => (selectedPostId ? getPostById(selectedPostId) : null),
    enabled: !!selectedPostId && isModalOpen,
    refetchOnWindowFocus: false,
  });

  const handleWriteButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    setSelectedPostId(null); // 글쓰기 모드로 시작
  };

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await supabase.auth.signOut();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  const handlePostCreated = (postId?: number) => {
    if (postId) {
      setSelectedPostId(postId); // 모달 내용을 상세 게시글로 변경
      queryClient.invalidateQueries({ queryKey: ['userPosts', user.id] });
    }
  };

  const handlePostDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['userPosts', user.id] });
    handleCloseModal();
  };

  const handlePostUpdated = async () => {
    queryClient.invalidateQueries({ queryKey: ['userPosts', user.id] });
    if (selectedPostId) {
      queryClient.invalidateQueries({ queryKey: ['post', selectedPostId] });
    }
  };

  return (
    <S.UserPageContainer>
      <S.UserPageHeader>
        {!isMobile && <UserProfileImage user={user} size={160} />}
        <S.UserPageHeaderInner>
          {isMobile && <UserProfileImage user={user} size={90} />}
          <S.UserNameAndMessageButton>
            {hasUserName && <S.UserInfoName>{getUserDisplayName}</S.UserInfoName>}
            {/* 내 프로필이 아닌 경우 메세지 보내기, 내 프로필인 경우 글쓰기 버튼 표시 */}
            {myInfo.id && user.id && myInfo.id !== user.id ? (
              <S.MessageButton href={`/j-stagram/message?userId=${user.id}`}>
                메세지 보내기
              </S.MessageButton>
            ) : myInfo.id && user.id && myInfo.id === user.id ? (
              <S.UserActionButtons>
                <S.WriteButton type='button' onClick={handleWriteButtonClick}>
                  글쓰기
                  <i className='fa-solid fa-pen'></i>
                </S.WriteButton>
                <S.LogoutButton type='button' onClick={handleLogout} aria-label='로그아웃'>
                  로그아웃
                  <i className='fa-solid fa-right-from-bracket'></i>
                </S.LogoutButton>
              </S.UserActionButtons>
            ) : null}
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

      {/* 글쓰기 모달 */}
      <PostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isPending={isModalPending || (!!selectedPostId && isLoadingSelectedPost)}
      >
        {selectedPostId && selectedPost ? ( // 등록된 후 게시글 상세 모달로 표시
          <JStagramFeed
            post={selectedPost}
            isModal={true}
            onPostDeleted={handlePostDeleted}
            onPostUpdated={handlePostUpdated}
            onPendingChange={setIsModalPending}
          />
        ) : (
          <PostForm
            onSuccess={handlePostCreated}
            createMode={true}
            onPendingChange={setIsModalPending}
          />
        )}
      </PostModal>
    </S.UserPageContainer>
  );
};

export default UserPage;
