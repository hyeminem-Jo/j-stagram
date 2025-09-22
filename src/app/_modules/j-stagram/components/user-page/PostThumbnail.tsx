'use client';

import * as S from './styled';
import { PostWithImages } from 'actions/postsActions';
import DateUtil from '@/app/_modules/common/utils/dateUtil';

interface PostThumbnailProps {
  post: PostWithImages;
}

const PostThumbnail = ({ post }: PostThumbnailProps) => {
  const hasImage = post.images && post.images.length > 0;

  return (
    <S.PostThumbnailContainer>
      {hasImage ? (
        <S.PostThumbnailImage src={post.images[0].url} alt={post.title || 'Post image'} />
      ) : (
        <S.PostThumbnailTextContainer>
          <S.PostThumbnailDate>{DateUtil.format(post.created_at)}</S.PostThumbnailDate>
          <S.PostThumbnailText>{post.content}</S.PostThumbnailText>
        </S.PostThumbnailTextContainer>
      )}
      <S.PostThumbnailOverlay className='overlay'>
        <S.LikeInfo>
          <S.HeartIcon>❤️</S.HeartIcon>
          <span>{post.like_count}</span>
        </S.LikeInfo>
      </S.PostThumbnailOverlay>
    </S.PostThumbnailContainer>
  );
};

export default PostThumbnail;
