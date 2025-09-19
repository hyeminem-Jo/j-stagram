import styled from '@emotion/styled';
import { BREAKPOINT_SM } from '@/app/_modules/common/constant/breakpoint';

export const JStagramFeedContainer = styled.div`
  width: 50rem;
  margin-bottom: 2rem;
  border-radius: 1rem;
  border: 1px solid #dbdbdb;
  background: white;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: ${BREAKPOINT_SM}px) {
    width: 100%;
    margin-bottom: 1rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

export const FeedHeader = styled.div`
  padding: 1.5rem;
  padding-bottom: 0;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 0.8rem 1rem;
  }
`;

export const UserProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const Username = styled.span`
  font-size: 1.6rem;
  font-weight: 600;
  color: #262626;
  line-height: 1.2;
`;

export const PostDate = styled.span`
  font-size: 1.4rem;
  color: #8e8e8e;
  line-height: 1.2;
`;

export const FeedImageWrap = styled.div`
  width: 100%;
  /* height: 400px; */
  padding: 1.5rem;

  @media (max-width: ${BREAKPOINT_SM}px) {
    /* height: 300px; */
  }
`;

export const ImageSliderContainer = styled.div`
  position: relative;
  border: 1px solid blue;

  .slick-dots {
    bottom: 15px;

    li button:before {
      color: white;
      font-size: 8px;
      opacity: 0.5;
    }

    li.slick-active button:before {
      opacity: 1;
    }
  }

  .slick-prev,
  .slick-next {
    z-index: 2;
    width: 30px;
    height: 30px;

    &:before {
      font-size: 30px;
      color: white;
    }
  }

  .slick-prev {
    left: 15px;
  }

  .slick-next {
    right: 15px;
  }
`;

export const SlideImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  line-height: 0;
  overflow: hidden;
`;

export const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FeedContent = styled.div`
  padding: 1.5rem;

  @media (max-width: ${BREAKPOINT_SM}px) {
    padding: 1rem;
  }
`;

export const FeedTitle = styled.h3`
  font-size: 1.7rem;
  font-weight: 600;
  color: #262626;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

export const FeedDescription = styled.p`
  font-size: 1.5rem;
  color: #8e8e8e;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
`;
