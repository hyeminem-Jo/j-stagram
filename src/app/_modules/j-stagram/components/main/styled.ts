import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const JStagramHomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  gap: 2rem;
  width: 100%;
  height: 100dvh;

  @media (max-width: ${BREAKPOINT_SM}px) {
    gap: 1.5rem;
    height: calc(100dvh - 8rem);
  }
`;

export const JStagramHomeDesc = styled.div`
  color: #222;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  span {
    color: #aaa;
    font-size: 1.9rem;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    h2 {
      font-size: 2.7rem;
    }

    span {
      font-size: 1.7rem;
    }
  }
`;

export const JStagramHomeGreeting = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 3rem;
  font-weight: 600;
`;

export const JStagramHomeMyName = styled.strong`
  color: orange;
`;
