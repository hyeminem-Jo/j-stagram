import styled from '@emotion/styled';
import Link from 'next/link';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';
import { css } from '@emotion/react';

interface SideBarProfileLinkProps {
  $hasImage: boolean;
  $isActive?: boolean;
}

interface SideBarLinkProps {
  $isActive?: boolean;
}

export const SideBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 9rem;
  height: 100dvh;
  padding: 3rem 2rem 4rem;
  border-right: 1px solid #ccc;
  z-index: 100;
  background-color: #fff;

  @media (max-width: ${BREAKPOINT_SM}px) {
    top: initial;
    bottom: 0;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 2.5rem;
    height: 8rem;
    border-right: none;
    border-top: 1px solid #ccc;
  }
`;

export const SideBarContent = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 10rem;

  @media (max-width: ${BREAKPOINT_SM}px) {
    order: 1;
    flex-direction: row;
    align-items: center;
    gap: 1.2rem;
    margin-top: 0;
  }
`;

export const SideBarHomeLink = styled(Link)`
  display: block;
  width: 4rem;
  height: 4rem;
  margin: 0 auto;
  background-image: url('/assets/images/jstagram-icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: ${BREAKPOINT_SM}px) {
    order: 2;
    width: 3.5rem;
    height: 3.5rem;
    margin: 0;
  }
`;

export const SideBarLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== '$isActive',
})<SideBarLinkProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
  border-radius: 1rem;

  i {
    font-size: 2.3rem;
  }

  &:hover {
    background-color: #f0f0f0;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: #f0f0f0;
      font-weight: bold;
    `}

  @media (max-width: ${BREAKPOINT_SM}px) {
    width: 4.5rem;
    height: 4.5rem;
    margin: 0;

    i {
      font-size: 2.5rem;
    }
  }
`;

export const SideBarProfileLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== '$hasImage' && prop !== '$isActive',
})<SideBarProfileLinkProps>`
  position: relative;
  width: 85%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  overflow: hidden;
  margin: 1.5rem auto 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${({ $hasImage }) =>
    !$hasImage &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eee;
      i {
        font-size: 1.7rem;
      }
    `}

  @media (max-width: ${BREAKPOINT_SM}px) {
    width: 3.6rem;
    height: 3.6rem;
    margin: 0;
    margin-left: 0.5rem;
    border: 1px solid #222;

    i {
      font-size: 1.5rem;
    }
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      outline: 2px solid orange;
      outline-offset: 2px;

      @media (max-width: ${BREAKPOINT_SM}px) {
        border: none;
      }
    `}
`;

export const SideBarLogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  aspect-ratio: 1/1;
  border-radius: 1rem;

  &:hover {
    background-color: #f0f0f0;
  }

  i {
    font-size: 2.3rem;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    display: none;
  }
`;
