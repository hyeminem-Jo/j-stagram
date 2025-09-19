import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const JStagramFeedContainer = styled.div`
  max-width: 70rem;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid #ccc;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.05), -8px -8px 16px rgba(255, 255, 255, 0.8);

  @media (max-width: ${BREAKPOINT_SM}px) {
    flex: initial;
    width: 100%;
  }
`;
