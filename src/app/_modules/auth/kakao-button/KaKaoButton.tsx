import Button from '@/app/_modules/common/components/button/button/Button';
import * as S from './styled';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import Image from 'next/image';

const KaKaoButton = () => {
  const supabase = createBrowserSupabaseClient();

  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        // 로컬 테스트
        // redirectTo: 'http://localhost:3000/api/auth/callback',
        redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `${process.env.NEXT_PUBLIC_VERCEL_URL}api/auth/callback`
          : 'http://localhost:3000/api/auth/callback',
      },
    });

    if (data) {
      console.log(data, '카카오 로그인 성공');
    }

    if (error) {
      alert(error.message);
      throw new Error(error.message);
    }
  };

  return (
    <Button
      type='button'
      text={
        <S.KaKaoButtonInner>
          <Image src='/assets/images/kakao-logo.png' alt='kakao' width={20} height={20} />
          <span>카카오 로그인</span>
        </S.KaKaoButtonInner>
      }
      onClick={signInWithKakao}
      size='md'
      filled
      widthFull
      bgColor='#FEE300'
      textColor='#222'
    />
  );
};

export default KaKaoButton;
