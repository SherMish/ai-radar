import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WebsiteType } from '@/lib/models/Website';

export function useBusinessGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [website, setWebsite] = useState<WebsiteType | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'business_owner') {
      router.push('/');
      return;
    }

    if (!session.user.websites) {
      router.push('/business/register');
      return;
    }

    // Fetch website details
    const fetchWebsite = async () => {
      try {
        console.log('Fetching website for ID:', session.user.websites);
        const res = await fetch(`/api/website/get?id=${session.user.websites}`);
        if (res.ok) {
          const data = await res.json();
          setWebsite(data);
        } else if (res.status === 404) {
          console.log('Website not found, retrying...');
          setTimeout(fetchWebsite, 2000);
        } else {
          console.error('Error response:', res.status, await res.text());
          setTimeout(fetchWebsite, 2000);
        }
      } catch (error) {
        console.error('Error fetching website:', error);
        setTimeout(fetchWebsite, 2000);
      }
    };

    fetchWebsite();
  }, [session, status, router]);

  return {
    isLoading: status === 'loading' || !website,
    website,
    user: session?.user
  };
} 