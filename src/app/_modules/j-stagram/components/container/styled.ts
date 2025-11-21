import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const JStagramContainer = styled.div`
  width: 100%;
  min-height: 100dvh;
  padding-left: 9rem;
  background-color: #f5f5f5;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding-left: 0;
    padding-bottom: 8rem;
  }
`;

export const JStagramContent = styled.div`
  line-height: 1.6;
  background-color: #fff;
`;
