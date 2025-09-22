import { notFound } from 'next/navigation';
import UserPage from '@/app/_modules/j-stagram/components/user-page/UserPage';
import { getUserByUsername } from 'actions/userActions';

interface UserProfileProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfile({ params }: UserProfileProps) {
  const { username } = await params;
  const userInfo = await getUserByUsername(username);

  if (!userInfo) {
    notFound();
  }

  return <UserPage user={userInfo} />;
}
