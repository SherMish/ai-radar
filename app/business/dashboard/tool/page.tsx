"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";

export default function ToolPage() {
  const { isLoading, website } = useBusinessGuard();
  const [formData, setFormData] = useState({
    name: website?.name || "",
    description: website?.description || "",
    shortDescription: website?.shortDescription || "",
    logo: website?.logo || "",
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
          Tool Page
        </h1>
        <p className="text-gray-400">Customize how your tool appears on AI Radar</p>
      </div>

      <Card className="p-6 bg-black/50 backdrop-blur border border-white/[0.08]">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Tool Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-black/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Short Description</label>
            <Input
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="bg-black/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Full Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-black/30"
              rows={6}
            />
          </div>

          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 