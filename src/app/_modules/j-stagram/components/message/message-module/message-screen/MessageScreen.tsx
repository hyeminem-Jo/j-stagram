'use client';

import MessageUser from '../message-user/MessageUser';
import Input from '@/app/_modules/common/components/form/input/Input';
import Button from '@/app/_modules/common/components/button/button/Button';
import * as S from './styled';
import { useIsMobile } from '@/app/_modules/common/hooks/useIsMobile';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from '../message-bubble/MessageBubble';
import { useAtomValue } from 'jotai';
import { presenceState, selectedChatUserIdState } from '@/app/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserById } from 'actions/messageActions';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { handleError } from 'actions/actionUtils';
import { MyInfo } from '@/app/types/commonType';

export async function sendMessage({
  message,
  otherUserId,
}: {
  message: string;
  otherUserId: string;
}) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase.from('message').insert({
    message,
    receiver: otherUserId, // supabase 에서 sender 는 자동으로 현재 사용자로 등록됨
  });

  if (error) {
    handleError(error);
  }

  return data;
}

export async function getAllMessages({ otherUserId }: { otherUserId: string }) {
  const supabase = createBrowserSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    throw new Error('로그인 후 이용해주세요.');
  }

  const { data, error: getAllMessagesError } = await supabase
    .from('message')
    .select('*')
    .or(`sender.eq.${session.user.id},sender.eq.${otherUserId}`)
    .or(`receiver.eq.${session.user.id},receiver.eq.${otherUserId}`)
    .order('created_at', { ascending: true });

  if (getAllMessagesError) {
    handleError(error);
    return [];
  }

  return data;
}

const MessageScreen = () => {
  const [message, setMessage] = useState<string>('');
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const selectedChatUserId = useAtomValue(selectedChatUserIdState);
  const supabase = createBrowserSupabaseClient();
  const presence = useAtomValue(presenceState);

  const scrollToBottom = (isSmooth: boolean = false) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: isSmooth ? 'smooth' : 'auto',
      });
    }
  };

  const selectedChatUserQuery = useQuery({
    queryKey: ['selectedChatUser', selectedChatUserId],
    queryFn: () => getUserById(selectedChatUserId),
    enabled: !!selectedChatUserId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      await sendMessage({ message, otherUserId: selectedChatUserId });
    },
    onSuccess: () => {
      setMessage('');
      getAllMessagesQuery.refetch();
      inputRef.current?.focus();
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ['messages', selectedChatUserId],
    queryFn: () => getAllMessages({ otherUserId: selectedChatUserId }),
    enabled: !!selectedChatUserId,
  });

  // 처음 메시지 접근시 스크롤 맨 아래로 이동
  // TODO: 첫 진입시 스크롤 맨 아래로 이동 안됨
  useEffect(() => {
    if (selectedChatUserId !== '' && chatContainerRef.current) {
      scrollToBottom(false);
    }
    console.log('selectedChatUserId', selectedChatUserId, chatContainerRef.current);
  }, [selectedChatUserId]);

  // 메시지 데이터가 로드될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (getAllMessagesQuery.data) {
      scrollToBottom(true);
    }
  }, [getAllMessagesQuery.data, selectedChatUserId]);

  useEffect(() => {
    const channel = supabase
      .channel('message_postgres_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'message' },
        (payload) => {
          if (payload.eventType === 'INSERT' && !payload.errors) {
            getAllMessagesQuery.refetch();
          }
        },
      );

    channel.subscribe();

    return () => {
      channel.unsubscribe(); // MessageScreen 컴포넌트가 언마운트될 때 채널 구독 해제
    };
  }, [getAllMessagesQuery, supabase]);

  return (
    <S.MessageScreenContainer>
      {selectedChatUserQuery.data ? (
        <>
          <MessageUser
            user={selectedChatUserQuery.data as unknown as MyInfo}
            onlineAt={(() => {
              const userPresence = presence?.[selectedChatUserQuery.data.id];
              return Array.isArray(userPresence) && userPresence.length > 0
                ? userPresence[0]?.online_at || ''
                : '';
            })()}
            // onlineAt={presence?.[selectedChatUserQuery.data.id]?.[0]?.online_at || ''}
            isChat
          />
          <S.MessageScreenChat ref={chatContainerRef}>
            {getAllMessagesQuery.data?.map((message) => (
              <MessageBubble
                key={message.id}
                isMe={message.receiver === selectedChatUserId}
                message={message.message}
              />
            ))}
          </S.MessageScreenChat>
          <S.MessageScreenChatForm
            onSubmit={(e) => {
              e.preventDefault();
              if (message.trim()) {
                sendMessageMutation.mutate();
              }
            }}
          >
            <Input
              id='chat'
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              width={!isMobile ? 500 : undefined}
              inputRef={inputRef}
            />
            <Button
              type='submit'
              text='전송'
              size='md'
              filled
              bgColor='dodgerblue'
              textColor='white'
              disabled={!message}
              loading={sendMessageMutation.isPending}
            />
          </S.MessageScreenChatForm>
        </>
      ) : (
        <S.MessageScreenNoChat>
          <h2>Message 💬</h2>
          <span>채팅 상대를 선택해주세요.</span>
        </S.MessageScreenNoChat>
      )}
    </S.MessageScreenContainer>
  );
};

export default MessageScreen;
