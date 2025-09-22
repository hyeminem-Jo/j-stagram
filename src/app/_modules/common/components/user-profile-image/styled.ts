import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BREAKPOINT } from '@/app/_modules/common/constant/breakpoint';
import Link from 'next/link';

interface Props {
  $hasImage: boolean;
  $size: number;
  $mobileSize: number;
}

export const ProfileImage = styled(Link, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<Props>`
  position: relative;
  width: ${({ $size }) => `${$size}rem`};
  aspect-ratio: 1/1;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${({ $hasImage, $size }) =>
    !$hasImage &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e5e5e5;
      i {
        font-size: ${$size / 2.5 + 'rem'};
        &::before {
          color: #aaa;
        }
      }
    `}

  @media (max-width: ${BREAKPOINT}px) {
    width: ${({ $mobileSize }) => `${$mobileSize}rem`};
    margin: 0;

    i {
      font-size: ${({ $mobileSize }) => `${$mobileSize / 3}rem`};
    }
  }
`;
