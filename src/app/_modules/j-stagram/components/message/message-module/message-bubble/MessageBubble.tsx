'use client';

import * as S from './styled';

interface MessageBubbleProps {
  isMe: boolean;
  message: string;
}

const MessageBubble = ({ isMe, message }: MessageBubbleProps) => {
  return (
    <S.MessageBubbleContainer $isMe={isMe}>
      <S.MessageBubble $isMe={isMe}>{message}</S.MessageBubble>
    </S.MessageBubbleContainer>
  );
};

export default MessageBubble;
