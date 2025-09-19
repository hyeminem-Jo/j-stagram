'use client';

import * as S from './styled';
import { PostWithImages } from 'actions/postsActions';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import UserProfileImage from '@/app/_modules/common/components/user-profile-image/UserProfileImage';
import DateUtil from '@/app/_modules/common/utils/dateUtil';

const JStagramFeed = ({ post }: { post: PostWithImages }) => {
  const sliderSettings = {
    dots: true,
    infinite: post.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: post.images.length > 1,
    adaptiveHeight: true,
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

  return (
    <S.JStagramFeedContainer>
      {/* 사용자 프로필 헤더 */}
      <S.FeedHeader>
        <S.UserProfileSection>
          <UserProfileImage user={userForProfile} size={40} mobileSize={35} />
          <S.UserInfo>
            <S.Username>{displayName}</S.Username>
            <S.PostDate>{DateUtil.format(post.created_at)}</S.PostDate>
          </S.UserInfo>
        </S.UserProfileSection>
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
      <S.FeedContent>
        <S.FeedTitle>{post.title}</S.FeedTitle>
        <S.FeedDescription>{JSON.stringify(post)}</S.FeedDescription>
        {/* <S.FeedDescription>{post.content}</S.FeedDescription> */}
      </S.FeedContent>
    </S.JStagramFeedContainer>
  );
};

export default JStagramFeed;
