import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const MessageUserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
  overflow-y: auto;
  height: 100dvh;
  border-right: 1px solid #ddd;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: ${BREAKPOINT_SM}px) {
    width: 100%;
    height: 110px;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
`;

export const MessageUserList = styled.div`
  @media (max-width: ${BREAKPOINT_SM}px) {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    height: 100%;
  }
`;
