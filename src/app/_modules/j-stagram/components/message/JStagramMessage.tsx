'use client';

import MessageUserList from './message-module/message-user-list/MessageUserList';
import MessageScreen from './message-module/message-screen/MessageScreen';

import * as S from './styled';

const JStagramMessage = () => {
  return (
    <S.JStagramMessageContainer>
      <MessageUserList />
      <MessageScreen />
    </S.JStagramMessageContainer>
  );
};

export default JStagramMessage;
