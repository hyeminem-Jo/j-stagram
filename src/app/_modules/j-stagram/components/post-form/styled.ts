import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const StyledPostForm = styled.form<{ $isEditMode?: boolean; $isCreateMode?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: ${({ $isEditMode }) => ($isEditMode ? '100%' : '50rem')};
  margin: ${({ $isEditMode }) => ($isEditMode ? '0' : '0 auto 2rem')};

  & > div {
    width: 100%;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    gap: 0.5rem;
    width: 100%;
    padding: ${({ $isEditMode }) => ($isEditMode ? '0' : '0 1.5rem')};

    & > div {
      flex: 1;
    }
  }

  ${({ $isCreateMode }) =>
    $isCreateMode &&
    css`
      background-color: #f0f0f0;
      padding: 2rem;
      border-radius: 1rem;

      @media (max-width: ${BREAKPOINT_SM}px) {
        padding: 5rem 1.5rem 1.5rem;
      }
    `}
`;

export const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`;

export const SelectedFilesInfo = styled.span`
  flex: 1;
  text-align: left;
  font-size: 1.4rem;
  color: #888;
`;

// 편집 모드 관련 스타일 (feed/styled.ts에서 복사)
export const ImageThumbnailsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

export const ImageThumbnail = styled.div`
  position: relative;
  width: 8rem;
  height: 8rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #dbdbdb;

  @media (max-width: ${BREAKPOINT_SM}px) {
    width: 6rem;
    height: 6rem;
  }
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ThumbnailDeleteButton = styled.button`
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ed4956;
  font-size: 1.2rem;
  transition: all 0.2s;
  z-index: 2;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ImageLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 0.5rem;
`;

export const ImageLoadingSpinner = styled.div`
  width: 2.4rem;
  height: 2.4rem;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0095f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const EditButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const EditButton = styled.button<{ $variant?: 'save' | 'cancel' }>`
  padding: 0.8rem 1.6rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant }) =>
    $variant === 'save'
      ? css`
          background: #0095f6;
          color: white;

          &:hover {
            background: #0084d9;
          }

          &:disabled {
            background: #b2dffc;
            cursor: not-allowed;
          }
        `
      : css`
          background: #efefef;
          color: #262626;

          &:hover {
            background: #dbdbdb;
          }
        `}
`;
