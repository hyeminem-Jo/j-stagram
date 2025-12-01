import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const JStagramFeedContainer = styled.div`
  width: 50rem;
  border-radius: 1rem;
  border: 1px solid #dbdbdb;
  background: white;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: ${BREAKPOINT_SM}px) {
    width: 100%;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
    box-shadow: none;

    &:first-child {
      border-top: none;
    }
  }
`;

export const FeedHeader = styled.div`
  padding: 1.5rem;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 1.2rem;
  }
`;

export const UserProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
`;

export const UserInfo = styled.div`
  display: flex;
  width: 100%;
  gap: 1.4rem;
  align-items: center;
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #262626;
  font-size: 1.6rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 12rem;
  z-index: 10;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  overflow: hidden;
`;

export const DropdownMenuItem = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 1.4rem;
  color: #262626;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:first-of-type {
    border-bottom: 1px solid #dbdbdb;
  }

  &.delete {
    color: #ed4956;
  }
`;

export const MoreButtonContainer = styled.div<{ $isModal?: boolean }>`
  position: relative;

  @media (max-width: ${BREAKPOINT_SM}px) {
    ${({ $isModal }) =>
      $isModal &&
      css`
        position: absolute;
        right: 5rem;
      `}
  }
`;

export const Username = styled.span`
  position: relative;
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  line-height: 1.2;

  &::after {
    position: absolute;
    top: 50%;
    right: -0.8rem;
    display: block;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: #8e8e8e;
    transform: translateY(-50%);
    content: '';
  }
`;

export const PostDate = styled.span`
  font-size: 1.4rem;
  color: #8e8e8e;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LockIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1.2rem;
  margin-left: 0.5rem;

  i::before {
    color: #8e8e8e;
  }
`;

export const FeedImageWrap = styled.div`
  width: 100%;
  padding: 1.5rem;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 0;
  }
`;

export const ImageSliderContainer = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;

  .slick-list {
    aspect-ratio: 1 / 1;
    height: 100% !important;
  }

  .slick-dots {
    bottom: -30px;

    li {
      margin: 0 1px;
    }

    li button:before {
      color: gray;
      font-size: 8px;
      opacity: 0.3;
    }

    li.slick-active button:before {
      opacity: 1;
      color: orange;
    }
  }

  .slick-prev,
  .slick-next {
    z-index: 2;
    width: 30px;
    height: 30px;

    &:before {
      font-size: 30px;
      color: white;
      opacity: 1;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.3);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    &:hover:before {
      opacity: 0.9;
    }
  }

  .slick-prev {
    left: 15px;
  }

  .slick-next {
    right: 15px;
  }
`;

export const SlideImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  line-height: 0;
  overflow: hidden;
`;

export const SlideImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FeedContent = styled.div<{ hasImages?: boolean; imageCount?: number }>`
  padding: 1.7rem;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 1.5rem;
  }

  ${({ hasImages, imageCount }) =>
    hasImages
      ? css`
          padding-top: ${imageCount && imageCount >= 2 ? '2.5rem' : '0'};

          @media (max-width: ${BREAKPOINT_SM}px) {
            padding-top: ${imageCount && imageCount >= 2 ? '4rem' : '1.5rem'};
          }
        `
      : css`
          @media (max-width: ${BREAKPOINT_SM}px) {
            padding-top: 0;
          }
        `}
`;

export const FeedTitle = styled.h3`
  font-size: 1.7rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 0.8rem;
  line-height: 1.4;
`;

export const FeedDescription = styled.p<{ $isModal?: boolean; $hasImages?: boolean }>`
  font-size: 1.5rem;
  color: #222;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;

  ${({ $isModal, $hasImages }) =>
    $isModal &&
    css`
      max-height: ${$hasImages ? '150px' : 'auto'};
      overflow: auto;
      padding-bottom: 4rem;

      @media (max-width: ${BREAKPOINT_SM}px) {
        padding-bottom: 2rem;
      }
    `}
`;

// 편집 모드 관련 스타일
export const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

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

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

export const EditButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
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
