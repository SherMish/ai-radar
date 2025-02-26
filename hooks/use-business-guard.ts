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

    if (!session.user.businessId) {
      router.push('/business/register');
      return;
    }

    // Fetch website details
    const fetchWebsite = async () => {
      try {
        const res = await fetch(`/api/website/get?id=${session.user.businessId}`);
        if (res.ok) {
          const data = await res.json();
          setWebsite(data);
        }
      } catch (error) {
        console.error('Error fetching website:', error);
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