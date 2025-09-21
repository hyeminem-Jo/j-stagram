'use client';

import { useAtom } from 'jotai';
import { selectedChatUserIdState } from '@/app/store';
import MessageUser from '../message-user/MessageUser';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

import * as S from './styled';
import { useQuery } from '@tanstack/react-query';
import { getAllUserList } from 'actions/messageActions';
import { myInfoState, presenceState } from '@/app/store';
import { useEffect } from 'react';
import { MyInfo } from '@/app/types/commonType';

const MessageUserList = () => {
  const supabase = createBrowserSupabaseClient();
  const [selectedUserId, setSelectedUserId] = useAtom(selectedChatUserIdState);
  const [myInfo] = useAtom(myInfoState);
  const [presence, setPresence] = useAtom(presenceState);

  const getAllUserQuery = useQuery({
    queryKey: ['getAllUser'],
    queryFn: getAllUserList,
  });

  const filteredUsers = getAllUserQuery.data?.filter((user) => user.id !== myInfo?.id) || [];

  useEffect(() => {
    if (!myInfo?.id) return;

    const channel = supabase.channel('online_users', {
      config: {
        presence: {
          key: myInfo.id,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const newState = channel.presenceState();
      const newStateObj = JSON.parse(JSON.stringify(newState));
      setPresence(newStateObj);
      console.log('Channel data:', newStateObj);
    });

    channel.subscribe(async (status) => {
      console.log('채널 구독 상태:', status);

      if (status !== 'SUBSCRIBED') return;

      const newPresenceStatus = await channel.track({
        // user: myInfo?.id,
        online_at: new Date().toISOString(),
      });

      console.log('New presence status:', newPresenceStatus); // 트래킹 성공 여부
      console.log('현재 사용자가 온라인으로 등록됨:', newPresenceStatus === 'ok');
    });

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myInfo?.id]);
  // }, [myInfo?.id, setPresence, supabase]);
  // 의존성 배열에 myInfo?.id 가 없을 시 새로고침하면 채널 구독 해제(online_at 가 뜨지 x)

  return (
    <S.MessageUserListContainer>
      <S.MessageUserList>
        {filteredUsers.map((user) => (
          <MessageUser
            key={user.id}
            user={user as unknown as MyInfo}
            onClick={() => setSelectedUserId(user.id)}
            active={selectedUserId === user.id}
            onlineAt={(() => {
              const userPresence = presence?.[user.id];
              return Array.isArray(userPresence) && userPresence.length > 0
                ? userPresence[0]?.online_at || ''
                : '';
            })()}
            // onlineAt={presence?.[user.id]?.[0]?.online_at || ''}
          />
        ))}
      </S.MessageUserList>
    </S.MessageUserListContainer>
  );
};

export default MessageUserList;
