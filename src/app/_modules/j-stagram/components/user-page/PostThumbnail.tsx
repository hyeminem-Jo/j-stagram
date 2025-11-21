'use client';

import { useState, useEffect } from 'react';
import * as S from './styled';
import { PostWithImages, getPostById } from 'actions/postsActions';
import DateUtil from '@/app/_modules/common/utils/dateUtil';
import JStagramFeed from '@/app/_modules/j-stagram/components/feed/JStagramFeed';
import { useQuery } from '@tanstack/react-query';
import PostModal from './PostModal';

interface PostThumbnailProps {
  post: PostWithImages;
}

const PostThumbnail = ({ post }: PostThumbnailProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPending, setIsModalPending] = useState(false);
  const hasImage = post.images && post.images.length > 0;

  // 모달이 열렸을 때 최신 게시글 데이터 가져오기
  const { data: latestPost, refetch } = useQuery({
    queryKey: ['post', post.id],
    queryFn: () => getPostById(post.id),
    enabled: isModalOpen,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isModalOpen) {
      refetch();
    }
  }, [isModalOpen, refetch]);

  const handleThumbnailClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <S.PostThumbnailContainer onClick={handleThumbnailClick}>
        {hasImage ? (
          <S.PostThumbnailImage src={post.images[0].url} alt={post.title || 'Post image'} />
        ) : (
          <S.PostThumbnailTextContainer>
            <S.PostThumbnailDate>{DateUtil.format(post.created_at)}</S.PostThumbnailDate>
            <S.PostThumbnailText>{post.title}</S.PostThumbnailText>
          </S.PostThumbnailTextContainer>
        )}
        <S.PostThumbnailOverlay className='overlay'>
          <S.LikeInfo>
            <S.HeartIcon>❤️</S.HeartIcon>
            <span>{post.like_count}</span>
          </S.LikeInfo>
        </S.PostThumbnailOverlay>
      </S.PostThumbnailContainer>

      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} isPending={isModalPending}>
        <JStagramFeed
          post={latestPost || post}
          isModal={true}
          onPostDeleted={() => setIsModalOpen(false)}
          onPostUpdated={() => refetch()}
          onPendingChange={setIsModalPending}
        />
      </PostModal>
    </>
  );
};

export default PostThumbnail;
