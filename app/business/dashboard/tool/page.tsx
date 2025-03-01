"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useBusinessGuard } from "@/hooks/use-business-guard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import categoriesData from "@/lib/data/categories.json";
import { ImageUpload } from "@/components/image-upload";
import { Switch } from "@/components/ui/switch";
import { WebsiteType, PricingModel } from "@/lib/types/website";

const CHAR_LIMITS = {
  name: 50,
  shortDescription: 100,
  description: 1000,
};

interface FormData {
  name: string;
  url: string;
  category: string;
  description: string;
  shortDescription: string;
  logo: string | undefined;
  pricingModel: string;
  hasFreeTrialPeriod: boolean;
  hasAPI: boolean;
  launchYear: number | null;
}

interface FormErrors {
  name?: string;
  shortDescription?: string;
  description?: string;
}

export default function ToolPage() {
  const { isLoading, website } = useBusinessGuard();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    category: "",
    description: "",
    shortDescription: "",
    logo: undefined,
    pricingModel: "",
    hasFreeTrialPeriod: false,
    hasAPI: false,
    launchYear: null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (website) {
      setFormData({
        name: website.name,
        url: website.url,
        category: website.category || "",
        description: website.description || "",
        shortDescription: website.shortDescription || "",
        logo: website.logo || undefined,
        pricingModel: website.pricingModel || "",
        hasFreeTrialPeriod: website.hasFreeTrialPeriod || false,
        hasAPI: website.hasAPI || false,
        launchYear: website.launchYear || null,
      });
    }
  }, [website]);

  const handleSave = async () => {
    try {
      // Validate fields
      const newErrors: FormErrors = {};

      if (!formData.name.trim()) {
        newErrors.name = "Tool name is required";
      }
      if (!formData.shortDescription.trim()) {
        newErrors.shortDescription = "Short description is required";
      }
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      }

      setFormErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsSaving(true);
      const response = await fetch(`/api/admin/websites/${website?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update");
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000); // Hide after 10 seconds
      setFormErrors({});
    } catch (error) {
      console.error("Error updating website:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update tool. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
          Edit Tool
        </h1>
        <p className="text-gray-400">Keep your AI tool&apos;s profile up to date with the latest details, ensuring potential users have accurate information</p>
      </div>

      <Card className="p-6 bg-black/50 backdrop-blur border border-white/[0.08]">
        <div className="space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Logo</label>
            <ImageUpload
              value={formData.logo || ""}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, logo: url }))
              }
              onRemove={() => setFormData((prev) => ({ ...prev, logo: "" }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="grid gap-2 md:col-span-1">
              <label className="text-sm font-medium">Tool Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter tool name"
                maxLength={CHAR_LIMITS.name}
                className={`bg-background/50 ${
                  formErrors.name ? "border-red-500" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
              <p className="text-xs text-gray-500">
                {formData.name.length} / {CHAR_LIMITS.name}
              </p>
            </div>

            <div className="grid gap-2 md:col-span-3">
              <label className="text-sm font-medium">Short Description</label>
              <Input
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                placeholder="Brief description of your tool"
                maxLength={CHAR_LIMITS.shortDescription}
                className={`bg-background/50 ${
                  formErrors.shortDescription ? "border-red-500" : ""
                }`}
              />
              {formErrors.shortDescription && (
                <p className="text-sm text-red-500">
                  {formErrors.shortDescription}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {formData.shortDescription.length} /{" "}
                {CHAR_LIMITS.shortDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                disabled={true}
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="Enter tool URL"
                className="bg-background/50"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detailed description of your tool"
              className={`w-full h-32 rounded-md border bg-background/50 px-3 py-2 text-sm ${
                formErrors.description ? "border-red-500" : ""
              }`}
              maxLength={CHAR_LIMITS.description}
            />
            {formErrors.description && (
              <p className="text-sm text-red-500">{formErrors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length} / {CHAR_LIMITS.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Pricing Model</label>
              <Select
                value={formData.pricingModel}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, pricingModel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing model" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PricingModel).map((model) => (
                    <SelectItem key={model} value={model}>
                      {model.charAt(0).toUpperCase() +
                        model.slice(1).replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Launch Year</label>
              <Input
                type="number"
                value={formData.launchYear?.toString() || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    launchYear: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                min={2000}
                max={new Date().getFullYear()}
                className="bg-background/50"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Has Free Trial</label>
              <div className="h-10 flex items-center">
                <Switch
                  checked={formData.hasFreeTrialPeriod}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasFreeTrialPeriod: checked,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Has API</label>
              <div className="h-10 flex items-center">
                <Switch
                  checked={formData.hasAPI}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasAPI: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {showSuccess && (
              <p className="text-sm text-green-500">
                ✅ Your tool information has been updated successfully!
              </p>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gradient-button"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
