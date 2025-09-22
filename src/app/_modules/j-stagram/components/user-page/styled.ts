import styled from '@emotion/styled';
import { BREAKPOINT } from '@/app/_modules/common/constant/breakpoint';

export const UserPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  min-height: 100dvh;
  padding: 6rem 0 15rem;

  @media (max-width: ${BREAKPOINT}px) {
    min-height: calc(100dvh - 6rem);
    gap: 2rem;
    padding: 3rem 0;
  }
`;

export const UserPageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${BREAKPOINT}px) {
    gap: 2rem;
    justify-content: center;
  }
`;

export const UserInfo = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (max-width: ${BREAKPOINT}px) {
    display: flex;
    gap: 0.5rem;
  }
`;

export const UserInfoItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.7rem;

  @media (max-width: ${BREAKPOINT}px) {
    gap: 0.5rem;
  }
`;

export const UserInfoName = styled.h4`
  font-size: 2.8rem;
  font-weight: 700;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 2.3rem;
  }
`;

export const UserInfoItemTitle = styled.strong`
  font-size: 1.6rem;
  font-weight: 500;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.5rem;
  }
`;

export const UserInfoItemValue = styled.span`
  font-size: 1.6rem;
  font-weight: 400;
  color: #777;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.4rem;
  }
`;

export const UserPostsSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 4rem auto 0;
  padding: 0 2rem;

  @media (max-width: ${BREAKPOINT}px) {
    margin: 3rem auto 0;
    padding: 0 1rem;
  }
`;

export const UserPostsTitle = styled.h3`
  position: relative;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    content: '';
    display: block;
    width: calc((100% - 10rem) / 2);
    height: 1px;
    background-color: #ddd;
  }

  &::after {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    content: '';
    display: block;
    width: calc((100% - 10rem) / 2);
    height: 1px;
    background-color: #ddd;
  }

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;

export const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;

  @media (max-width: ${BREAKPOINT}px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 0.8rem;
  }
`;

export const PostThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;

  /* &:hover {
    transform: scale(1.02);
  } */

  &:hover .overlay {
    opacity: 1;
  }
`;

export const PostThumbnailOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

export const LikeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.8rem;
  font-weight: 600;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.6rem;
  }
`;

export const HeartIcon = styled.div`
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ff4757;

  @media (max-width: ${BREAKPOINT}px) {
    width: 2rem;
    height: 2rem;
    font-size: 1.8rem;
  }
`;

export const PostThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PostThumbnailTextContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e5e5e5 0%, #d0d0d0 50%, #b8b8b8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  gap: 0.8rem;
`;

export const PostThumbnailDate = styled.span`
  color: #777;
  font-size: 1.4rem;
  font-weight: 500;
  text-align: center;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.3rem;
  }
`;

export const PostThumbnailText = styled.p`
  color: #333;
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.4rem;
  }
`;

export const EmptyPostsMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #777;
  font-size: 1.6rem;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 1.4rem;
    padding: 3rem 1rem;
  }
`;
