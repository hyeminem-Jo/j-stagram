import styled from '@emotion/styled';
import { BREAKPOINT } from '@/app/_modules/common/constant/breakpoint';

export const JStagramMyPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  min-height: 100dvh;

  @media (max-width: ${BREAKPOINT}px) {
    flex-direction: column;
    min-height: calc(100dvh - 6rem);
    gap: 2rem;
  }
`;

export const JStagramMyPageTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 2.5rem;
    text-align: center;
  }
`;

export const JStagramMyInfoList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (max-width: ${BREAKPOINT}px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const JStagramMyInfoItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.7rem;

  @media (max-width: ${BREAKPOINT}px) {
    gap: 0.5rem;
  }
`;

export const JStagramMyInfoItemTitle = styled.strong`
  font-size: 1.6rem;
  font-weight: 500;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.5rem;
  }
`;

export const JStagramMyInfoItemValue = styled.span`
  font-size: 1.6rem;
  font-weight: 400;
  color: #777;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.4rem;
  }
`;
