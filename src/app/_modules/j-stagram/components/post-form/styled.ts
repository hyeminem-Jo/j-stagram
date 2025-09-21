import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const StyledPostForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 50rem;
  margin: 0 auto;
  margin-bottom: 2rem;

  & > div {
    width: 100%;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    flex-direction: row;
    gap: 0.5rem;
    width: 100%;
    padding: 0 1.5rem;

    & > div {
      flex: 1;
    }
  }
`;
