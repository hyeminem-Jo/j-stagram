'use client';

import { useEffect, ReactNode } from 'react';
import * as S from './styled';
import Loading from '@/app/_modules/common/components/loading/Loading';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  isPending?: boolean;
}

const PostModal = ({ isOpen, onClose, children, isPending = false }: PostModalProps) => {
  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // body 스크롤 방지 (배경만 막고, 모달 내부는 스크롤 가능)
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // cleanup: 스크롤 복원
        const savedScrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (savedScrollY) {
          window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
        }
      };
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <S.ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalCloseButton type='button' onClick={onClose} aria-label='닫기'>
          <i className='fa-solid fa-xmark'></i>
        </S.ModalCloseButton>
        {isPending ? (
          <S.ModalLoadingContainer>
            <Loading />
          </S.ModalLoadingContainer>
        ) : (
          children
        )}
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default PostModal;
