"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoginModal } from "@/hooks/use-login-modal";
import ReviewLayout from "@/components/review/review-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import categoriesJson from "@/lib/data/categories.json";
import { UploadImage } from "@/components/upload-image";

// Get the categories array from the JSON structure
const categories = categoriesJson.categories;

interface FormErrors {
  url?: string;
  name?: string;
  category?: string;
  shortDescription?: string;
}

export default function NewTool() {
  const router = useRouter();
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
    name: "",
    category: "",
    description: "",
    shortDescription: "",
    logo: undefined as string | undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Store form data in state when login modal is opened
  const [pendingSubmission, setPendingSubmission] = useState<null | typeof formData>(null);

  // Effect to handle post-authentication submission
  const submitForm = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      loginModal.onOpen();
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formData.url.trim(),
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          shortDescription: formData.shortDescription.trim(),
          logo: formData.logo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle duplicate URL error
        if (data.error === "This website has already been added") {
          setErrors(prev => ({
            ...prev,
            url: "This website has already been added. Please use a different URL."
          }));
          return;
        }
        throw new Error(data.error || "Failed to create website");
      }

      if (!data.url) {
        throw new Error("No URL returned from server");
      }

      toast({
        title: "Success",
        description: "Website added successfully",
      });

      router.push(`/tool/${encodeURIComponent(data.url)}`);
    } catch (error) {
      console.error("Website creation error:", error);
      
      // Only show toast for non-validation errors
      if (!errors.url) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to add website",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [session, formData, errors, loginModal, toast, router]);

  useEffect(() => {
    if (session && pendingSubmission) {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
      setPendingSubmission(null);
    }
  }, [session, pendingSubmission]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // URL validation
    if (!formData.url) {
      newErrors.url = "URL is required";
    } else {
      // URL pattern that matches most URLs without being too strict
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
      if (!urlPattern.test(formData.url)) {
        newErrors.url = "Please enter a valid URL";
      }
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    // Short description validation
    if (formData.shortDescription) {
      const wordCount = formData.shortDescription.trim().split(/\s+/).length;
      if (wordCount > 10) {
        newErrors.shortDescription = "Short description must be 10 words or less";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <ReviewLayout title="Add a New AI Tool">
      <Card className="p-6 bg-muted/50 border-border">
        <form onSubmit={submitForm} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="url" className="text-sm font-medium">
                Tool URL
              </label>
              <Input
                id="url"
                type="text"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value });
                  if (errors.url) {
                    setErrors({ ...errors, url: undefined });
                  }
                }}
                className={`w-full ${errors.url ? "border-red-500" : ""}`}
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Tool Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter tool name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                className={`w-full ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData({ ...formData, category: value });
                  if (errors.category) {
                    setErrors({ ...errors, category: undefined });
                  }
                }}
              >
                <SelectTrigger className={`w-full ${errors.category ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Enter a detailed description of the tool"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="shortDescription" className="text-sm font-medium">
                Short Description (Optional, max 10 words)
              </label>
              <Input
                id="shortDescription"
                type="text"
                placeholder="Brief description of the tool"
                value={formData.shortDescription}
                onChange={(e) => {
                  setFormData({ ...formData, shortDescription: e.target.value });
                  if (errors.shortDescription) {
                    setErrors({ ...errors, shortDescription: undefined });
                  }
                }}
                className={errors.shortDescription ? "border-red-500" : ""}
              />
              {errors.shortDescription && (
                <p className="text-sm text-red-500">{errors.shortDescription}</p>
              )}
            </div>

            {process.env.NEXT_PUBLIC_IS_PRODUCTION === 'false' && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Logo (Optional)
                </label>
                <UploadImage
                  onUpload={(url) => setFormData({ ...formData, logo: url })}
                  onClear={() => setFormData({ ...formData, logo: undefined })}
                  uploadedUrl={formData.logo}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Tool"}
            </Button>
          </div>
        </form>
      </Card>
    </ReviewLayout>
  );
} 