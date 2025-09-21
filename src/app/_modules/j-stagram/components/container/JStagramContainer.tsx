'use client';

import React, { useEffect } from 'react';
import * as S from './styled';
import SideBar from '../side-bar/SideBar';
import { MyInfo } from '@/app/types/commonType';
import { myInfoState } from '@/app/store';
import { useSetAtom } from 'jotai';

interface JStagramContainerProps {
  children: React.ReactNode;
  myData: MyInfo;
}

const JStagramContainer = ({ children, myData }: JStagramContainerProps) => {
  const setMyInfo = useSetAtom(myInfoState);

  useEffect(() => {
    setMyInfo(myData);
  }, [myData, setMyInfo]);

  return (
    <S.JStagramContainer>
      <SideBar />
      <S.JStagramContent>{children}</S.JStagramContent>
    </S.JStagramContainer>
  );
};

export default JStagramContainer;
