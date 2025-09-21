import { createServerSupabaseClient } from 'utils/supabase/server';
import AuthProvider from '@/app/config/AuthProvider';
import { MyInfo } from '@/app/types/commonType';
import JStagramAuthGate from '@/app/_modules/j-stagram/components/container/JStagramAuthGate';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <AuthProvider accessToken={session?.access_token || ''}>
      <JStagramAuthGate myData={session?.user as unknown as MyInfo}>{children}</JStagramAuthGate>
    </AuthProvider>
  );
}
