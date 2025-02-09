import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Types } from "mongoose";

interface WebsiteCardProps {
  website: {
    _id: Types.ObjectId;
    name: string;
    url: string;
    description?: string;
    shortDescription?: string;
    logo?: string;
    averageRating: number;
    reviewCount: number;
  };
}

export function WebsiteCard({ website }: WebsiteCardProps) {
console.log(website)
  return (
    <Link href={`/tool/${encodeURIComponent(website.url)}`}>
      <Card className="p-6 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors border-zinc-700/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
            {website.logo ? (
                <Image src={website.logo} alt={website.name} width={48} height={48} />
            ) : (
              <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center">
                <span className="text-xs text-zinc-400">{website.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold mb-1 text-zinc-50">
              {website.name}
            </h2>
            <p className="text-sm text-zinc-300 mb-3 truncate">
              {website.url}
            </p>
            {website.shortDescription && (
              <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                {website.shortDescription}
              </p>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (website.averageRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-400">
                {website.reviewCount || 0} reviews
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 