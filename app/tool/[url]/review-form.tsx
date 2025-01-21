"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StarRating } from "@/components/star-rating";

const reviewSchema = z.object({
  websiteUrl: z.string().url().optional(),
  websiteName: z.string().min(2).optional(),
  title: z.string().min(3).max(100),
  body: z.string().min(10),
  rating: z.number().min(1).max(5),
  proof: z.string().url().optional(),
  relatedPlan: z.string().optional(),
});

type ReviewFormProps = {
  isNewTool: boolean;
  existingUrl: string;
  websiteData: any | null;
};

export default function ReviewForm({ isNewTool, existingUrl, websiteData }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      websiteUrl: existingUrl,
      websiteName: websiteData?.name || "",
      title: "",
      body: "",
      rating: 0,
      proof: "",
      relatedPlan: "",
    },
  });

  async function onSubmit(data: z.infer<typeof reviewSchema>) {
    try {
      setIsSubmitting(true);
      
      if (isNewTool) {
        // First create the website
        const websiteResponse = await fetch("/api/websites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.websiteName,
            URL: data.websiteUrl,
            // Add other website fields as needed
          }),
        });
        
        if (!websiteResponse.ok) {
          throw new Error("Failed to create website");
        }
        
        const website = await websiteResponse.json();
        
        // Then create the review
        const reviewResponse = await fetch("/api/reviews/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            relatedWebsite: website._id,
          }),
        });
        
        if (!reviewResponse.ok) {
          throw new Error("Failed to create review");
        }
      } else {
        // Just create the review for existing website
        const response = await fetch("/api/reviews/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            relatedWebsite: websiteData._id,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to create review");
        }
      }
      
      // Redirect to the tool page
      window.location.href = `/tool/${encodeURIComponent(data.websiteUrl || existingUrl)}`;
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isNewTool && (
          <>
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="websiteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Tool Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input placeholder="Brief summary of your experience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <StarRating
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this tool"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proof (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Link to screenshot or other proof"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relatedPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan/Service Used (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Free Plan, Pro Plan, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
} 