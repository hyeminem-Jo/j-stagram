'use client';

import { useState, useRef, useEffect } from 'react';
import * as S from './styled';
import { PostWithImages, deletePost } from 'actions/postsActions';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import UserProfileImage from '@/app/_modules/common/components/user-profile-image/UserProfileImage';
import DateUtil from '@/app/_modules/common/utils/dateUtil';
import { useAtomValue } from 'jotai';
import { myInfoState } from '@/app/store';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/config/ReactQueryProvider';

const JStagramFeed = ({ post, isModal }: { post: PostWithImages; isModal?: boolean }) => {
  const myInfo = useAtomValue(myInfoState);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMyPost = myInfo?.id === post.user_id;
  const sliderSettings = {
    dots: true,
    infinite: post.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: post.images.length > 1,
    adaptiveHeight: false,
  };

  // 사용자명 결정 로직 (중복 제거)
  const getUserDisplayName = () => {
    return (
      post?.user_info?.user_metadata?.preferred_username ||
      post?.user_info?.user_metadata?.name ||
      post?.user_info?.email?.split('@')[0] ||
      `User_${post?.user_id?.slice(-8)}`
    );
  };

  const displayName = getUserDisplayName();

  // 사용자 객체 생성 (UserProfileImage 컴포넌트가 요구하는 MyInfo 형태)
  const userForProfile = {
    id: post.user_id,
    email: post.user_info?.email || '',
    phone: '',
    created_at: post.created_at,
    last_sign_in_at: post.created_at,
    user_metadata: {
      avatar_url: post.user_info?.user_metadata?.avatar_url || '',
      preferred_username: displayName,
      name: displayName,
      user_name: displayName,
    },
  };

  // 더보기 - 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 삭제 기능
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsDropdownOpen(false);
    },
    onError: (error) => {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    },
  });

  const handleDelete = () => {
    if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate(post.id);
    }
  };

  const handleEdit = () => {
    // TODO: 수정 기능 구현
    alert('수정 기능은 준비 중');
    setIsDropdownOpen(false);
  };

  return (
    <S.JStagramFeedContainer>
      {/* 사용자 프로필 헤더 */}
      <S.FeedHeader>
        <S.UserProfileSection>
          <UserProfileImage user={userForProfile} size={40} mobileSize={35} />
          <S.UserInfo>
            <S.Username>{displayName}</S.Username>
            <S.PostDate>{DateUtil.renderDateSnsType(post.created_at)}</S.PostDate>
          </S.UserInfo>
        </S.UserProfileSection>
        {isMyPost && (
          <S.MoreButtonContainer ref={dropdownRef} $isModal={isModal}>
            <S.MoreButton
              type='button'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label='더보기'
            >
              <i className='fa-solid fa-ellipsis-vertical' />
            </S.MoreButton>
            <S.DropdownMenu $isOpen={isDropdownOpen}>
              <S.DropdownMenuItem type='button' onClick={handleEdit}>
                수정하기
              </S.DropdownMenuItem>
              <S.DropdownMenuItem
                type='button'
                className='delete'
                onClick={handleDelete}
                disabled={deletePostMutation.isPending}
              >
                {deletePostMutation.isPending ? '삭제 중...' : '삭제하기'}
              </S.DropdownMenuItem>
            </S.DropdownMenu>
          </S.MoreButtonContainer>
        )}
      </S.FeedHeader>

      {/* 이미지 슬라이더 */}
      {post.images && post.images.length > 0 && (
        <S.FeedImageWrap>
          <S.ImageSliderContainer>
            <Slider {...sliderSettings}>
              {post.images.map((image, index) => (
                <S.SlideImageWrapper key={index}>
                  <S.SlideImage src={image.url} alt={`${post.title} - ${index + 1}`} />
                </S.SlideImageWrapper>
              ))}
            </Slider>
          </S.ImageSliderContainer>
        </S.FeedImageWrap>
      )}

      {/* 게시글 내용 */}
      <S.FeedContent
        hasImages={post.images && post.images.length > 0}
        imageCount={post.images?.length}
      >
        <S.FeedTitle>{post.title}</S.FeedTitle>
        <S.FeedDescription $isModal={isModal} $hasImages={post.images && post.images.length > 0}>
          {JSON.stringify(post)}
        </S.FeedDescription>
        {/* <S.FeedDescription>{post.content}</S.FeedDescription> */}
      </S.FeedContent>
    </S.JStagramFeedContainer>
  );
};

export default JStagramFeed;
