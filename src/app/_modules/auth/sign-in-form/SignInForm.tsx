'use client';

import * as S from './styled';
import Button from '@/app/_modules/common/components/button/button/Button';
import ControlledInput from '@/app/_modules/common/components/form/controlled-input/ControlledInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import KaKaoButton from '../kakao-button/KaKaoButton';

const schema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

const SignInForm = () => {
  const supabase = createBrowserSupabaseClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const signInMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof schema>) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (data) {
        console.log(data, '로그인 성공');
      }

      if (error) {
        if (error.message === 'Invalid login credentials') {
          alert('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else {
          alert(error.message);
        }
        throw new Error(error.message);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    signInMutation.mutate(data);
  };

  return (
    <S.SignInFormWrap onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput
        name='email'
        control={control}
        placeholder='이메일을 입력하세요.'
        error={errors.email}
      />
      <ControlledInput
        name='password'
        control={control}
        placeholder='비밀번호를 입력하세요.'
        type='password'
        maxLength={12}
        error={errors.password}
      />
      <Button
        type='submit'
        text='로그인'
        size='md'
        filled
        widthFull
        loading={signInMutation.isPending}
      />
      <KaKaoButton />
    </S.SignInFormWrap>
  );
};

export default SignInForm;
