'use client';

import React from 'react';
import * as S from './styled';

const HomeContainer = () => {
  return (
    <S.HomeContainer>
      <S.HomeContent>
        <S.HomeNav>
          <S.HomeNavItem href='/j-stagram'>
            <i className='fa-solid fa-camera'></i> j-stagram
          </S.HomeNavItem>
          <S.HomeNavItem href='/todo'>
            <i className='fa-solid fa-list'></i> Todo List
          </S.HomeNavItem>
          <S.HomeNavItem href='/gallery'>
            <i className='fa-solid fa-images'></i> Gallery
          </S.HomeNavItem>
          <S.HomeNavItem href='/movie'>
            <i className='fa-solid fa-film'></i> Movie
          </S.HomeNavItem>
        </S.HomeNav>
      </S.HomeContent>
    </S.HomeContainer>
  );
};

export default HomeContainer;
