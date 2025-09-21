'use client';

import AuthContainer from '@/app/_modules/auth/auth-container/AuthContainer';
import JStagramContainer from '@/app/_modules/j-stagram/components/container/JStagramContainer';
import { MyInfo } from '@/app/types/commonType';

export default function JStagramAuthGate({
  myData,
  children,
}: {
  myData: MyInfo | null;
  children: React.ReactNode;
}) {
  if (!myData) {
    return <AuthContainer />;
  }
  return <JStagramContainer myData={myData}>{children}</JStagramContainer>;
}
