import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const JStagramSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  overflow: hidden;

  @media (max-width: ${BREAKPOINT_SM}px) {
    height: calc(100dvh - 8rem);
  }
`;

export const JStagramSearchHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`;

export const JStagramSearchTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 600;
  color: #222;
  text-align: center;
  margin: 0;

  @media (max-width: ${BREAKPOINT_SM}px) {
    font-size: 2rem;
  }
`;

export const JStagramSearchInputWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

export const JStagramSearchContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 3rem 2rem 2rem;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 1.5rem 1.5rem;
  }
`;

export const JStagramSearchEmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 300px;

  p {
    font-size: 1.8rem;
    color: #999;
    text-align: center;
    margin: 0;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    min-height: 200px;

    p {
      font-size: 2rem;
    }
  }
`;

export const JStagramSearchDesc = styled.div`
  color: #222;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    font-size: 3rem;
    font-weight: 600;
  }

  span {
    color: #aaa;
    font-size: 2rem;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    h2 {
      font-size: 2.5rem;
    }

    span {
      font-size: 1.8rem;
    }
  }
`;
