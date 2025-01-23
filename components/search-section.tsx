import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ _id: string; name: string; url: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add debounced search function
  useEffect(() => {
    const searchWebsites = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/websites/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        console.log('Search API response:', data);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchWebsites, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative max-w-2xl mx-auto w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search AI tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-10">
          {results.map((website) => {
            console.log('Rendering website item:', website); // Debug log
            return (
              <button
                key={website._id}
                onClick={() => {
                  console.log('Clicked website:', website);
                  if (website.url) {
                    const redirectUrl = `/tool/${encodeURIComponent(website.url)}`;
                    console.log('Redirecting to:', redirectUrl);
                    router.push(redirectUrl);
                    setQuery('');
                    setResults([]);
                  } else {
                    console.error('Website missing URL:', website);
                  }
                }}
                className="w-full px-4 py-2 text-left hover:bg-muted/50 flex items-center gap-2"
              >
                <span className="font-medium">{website.name}</span>
                <span className="text-sm text-muted-foreground">({website.url})</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 