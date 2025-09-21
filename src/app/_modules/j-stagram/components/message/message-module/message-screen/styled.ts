import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const MessageScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100dvh;

  @media (max-width: ${BREAKPOINT_SM}px) {
    flex: initial;
    height: calc(100dvh - 170px);
  }
`;

export const MessageScreenChat = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 1rem;
  }
`;

export const MessageScreenChatForm = styled.form`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  padding-bottom: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

  & > :nth-child(1) {
    flex: 1;
    width: 100%;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 0.8rem;
  }
`;

export const MessageScreenNoChat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
  height: 100%;

  h2 {
    font-size: 3.7rem;
    font-weight: 600;
  }

  span {
    font-size: 1.8rem;
    font-weight: 500;
    color: #999;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    h2 {
      font-size: 2.5rem;
    }

    span {
      font-size: 1.5rem;
    }
  }
`;
