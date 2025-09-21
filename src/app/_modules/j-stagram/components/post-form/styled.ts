import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const StyledPostForm = styled.form`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 50rem;
  margin: 0 auto;
  margin-bottom: 2rem;

  @media (max-width: ${BREAKPOINT_SM}px) {
    gap: 0.5rem;
    width: 100%;
  }
`;
