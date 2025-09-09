import { notFound } from 'next/navigation';
import UserProfilePage from '@/components/UserProfilePage';

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

async function getUserByUsername(username: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users?username=${username}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const users = await response.json();
    return users[0] || null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export default async function UserProfileRoute({ params }: UserProfilePageProps) {
  const user = await getUserByUsername(params.username);
  
  if (!user) {
    notFound();
  }
  
  return <UserProfilePage user={user} />;
}

