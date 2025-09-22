import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

type MessageUserContainerProps = {
  $active?: boolean;
  $isChat?: boolean;
  $isOnline?: boolean;
  isChat?: boolean;
};

export const MessageUserContainer = styled.button<MessageUserContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  gap: 1rem;
  padding: 1.2rem;
  background-color: ${({ $active }) => ($active ? '#e6f2ff' : 'transparent')};

  ${({ $isChat }) =>
    $isChat
      ? css`
          width: 100%;
          background-color: #f5f5f5;
          cursor: default;
        `
      : css`
          &:hover {
            background-color: #e6f2ff;
          }
        `}

  img {
    border-radius: 50%;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    gap: 0.5rem;

    ${({ $isChat }) =>
      !$isChat &&
      css`
        flex-direction: column;
        width: auto;
        height: 100%;
        padding: 1.2rem 1.5rem;
        span {
          font-size: 1.2rem;
        }
      `}
  }
`;

export const MessageUserImageWrap = styled.div<MessageUserContainerProps>`
  position: relative;
  border-radius: 50%;

  ${({ isChat }) =>
    !isChat &&
    css`
      pointer-events: none;
    `}

  ${({ $isOnline }) =>
    $isOnline &&
    css`
      &::after {
        content: '';
      }
    `}

  &::after {
    position: absolute;
    top: -1px;
    right: -1px;
    width: 10px;
    height: 10px;
    background-color: #32cd32;
    border-radius: 50%;
    border: 2px solid #fff;
  }
`;

export const MessageUserInfo = styled.div<MessageUserContainerProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
  width: 100%;
  overflow: hidden;

  @media (max-width: ${BREAKPOINT_SM}px) {
    ${({ $isChat }) =>
      !$isChat &&
      css`
        text-align: center;
      `}
  }
`;

export const MessageUserName = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
`;

export const MessageUserOnlineAt = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
  color: #888;
`;
