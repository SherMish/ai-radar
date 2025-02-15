"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import { WebsiteType } from '@/lib/types/website';
import { WebsiteCard } from './website-card';
import { AddToolDialog } from './add-tool-dialog';

export function AdminDashboard() {
  const router = useRouter();
  const [websites, setWebsites] = useState<WebsiteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);
  
  const isLocal = !process.env.NEXT_PUBLIC_IS_PRODUCTION && window.location.hostname.includes('localhost');

  useEffect(() => {
    if (!isLocal) {
      router.push('/');
      return;
    }
    fetchWebsites();
  }, [router]);

  const fetchWebsites = async () => {
    try {
      const response = await fetch('/api/admin/websites');
      const data = await response.json();
      setWebsites(data);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWebsites = websites.filter(website => 
    website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    website.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button 
          onClick={() => setIsAddToolOpen(true)}
          className="gradient-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Tool
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading tools...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredWebsites.map((website) => (
            <WebsiteCard
              key={website._id}
              website={website}
              onUpdate={fetchWebsites}
            />
          ))}
        </div>
      )}

      <AddToolDialog 
        open={isAddToolOpen} 
        onOpenChange={setIsAddToolOpen}
        onToolAdded={fetchWebsites}
      />
    </div>
  );
} 