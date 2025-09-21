import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const JStagramMessageContainer = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 100dvh;

  @media (max-width: ${BREAKPOINT_SM}px) {
    min-height: calc(100dvh - 60px);
    flex-direction: column;
  }
`;
