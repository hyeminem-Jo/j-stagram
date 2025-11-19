import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const JStagramFeedListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  width: 100%;
  padding: 0 2rem;

  @media (max-width: ${BREAKPOINT_SM}px) {
    gap: 2.5rem;
    padding: 0;
    background-color: #fff;
  }
`;
