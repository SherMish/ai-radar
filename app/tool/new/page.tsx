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

// Get the categories array from the JSON structure
const categories = categoriesJson.categories;

interface FormErrors {
  url?: string;
  name?: string;
  category?: string;
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
      submitForm(new Event('submit'));
      setPendingSubmission(null);
    }
  }, [session, pendingSubmission, submitForm]);

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