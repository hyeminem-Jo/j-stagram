import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

interface MessageBubbleContainerProps {
  $isMe: boolean;
}

export const MessageBubbleContainer = styled.div<MessageBubbleContainerProps>`
  display: flex;
  justify-content: ${({ $isMe }) => ($isMe ? 'flex-end' : 'flex-start')};
  width: 100%;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MessageBubble = styled.div<MessageBubbleContainerProps>`
  max-width: 350px;
  width: fit-content;
  height: fit-content;
  word-break: break-all;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.8rem;
  font-weight: 500;
  line-height: 1.2;
  background-color: ${({ $isMe }) => ($isMe ? 'dodgerblue' : '#f0f0f0')};

  ${({ $isMe }) =>
    $isMe &&
    css`
      color: white;
    `}

  @media (max-width: ${BREAKPOINT_SM}px) {
    max-width: 200px;
    font-size: 1.6rem;
  }
`;
