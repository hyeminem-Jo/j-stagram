'use client';

import { useState, useEffect } from 'react';
import * as S from './styled';
import { PostWithImages } from 'actions/postsActions';
import DateUtil from '@/app/_modules/common/utils/dateUtil';
import JStagramFeed from '@/app/_modules/j-stagram/components/feed/JStagramFeed';

interface PostThumbnailProps {
  post: PostWithImages;
}

const PostThumbnail = ({ post }: PostThumbnailProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasImage = post.images && post.images.length > 0;

  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isModalOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // cleanup 시에도 복원
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isModalOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  const handleThumbnailClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
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

      <S.ModalOverlay $isOpen={isModalOpen} onClick={handleOverlayClick}>
        <S.ModalContent onClick={(e) => e.stopPropagation()}>
          <S.ModalCloseButton type='button' onClick={handleCloseModal} aria-label='닫기'>
            <i className='fa-solid fa-xmark'></i>
          </S.ModalCloseButton>
          <JStagramFeed post={post} isModal={true} />
        </S.ModalContent>
      </S.ModalOverlay>
    </>
  );
};

export default PostThumbnail;
