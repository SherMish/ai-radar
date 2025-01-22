"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Upload, Eye, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ReviewData {
  url?: string;
  name?: string;
  rating: number;
  title: string;
  content: string;
  proofFiles: File[];
}

interface ReviewFormProps {
  isNewTool?: boolean;
  initialUrl?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export default function ReviewForm({ isNewTool = false, initialUrl = "" }: ReviewFormProps) {
  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [reviewData, setReviewData] = useState<ReviewData>({
    url: initialUrl,
    name: "",
    rating: 0,
    title: "",
    content: "",
    proofFiles: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const errors: { [key: string]: string } = {};

    const validFiles = files.filter(file => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.files = "Invalid file type. Please upload JPG, PNG, or PDF files only.";
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.files = "File size exceeds 10MB limit.";
        return false;
      }
      return true;
    });

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setReviewData(prev => ({
        ...prev,
        proofFiles: [...prev.proofFiles, ...validFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      proofFiles: prev.proofFiles.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (isNewTool) {
      if (!reviewData.url?.trim()) {
        errors.url = "Please enter the tool's URL";
      }
      if (!reviewData.name?.trim()) {
        errors.name = "Please enter the tool's name";
      }
    }
    if (reviewData.rating === 0) {
      errors.rating = "Please select a rating";
    }
    if (!reviewData.title.trim()) {
      errors.title = "Please enter a review title";
    }
    if (reviewData.content.length < 50) {
      errors.content = "Review must be at least 50 characters long";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      let websiteId = initialUrl;

      // If it's a new tool, create it first
      if (isNewTool) {
        const websiteResponse = await fetch("/api/websites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: reviewData.name,
            URL: reviewData.url,
            description: "", // Can be added later
            features: [], // Can be added later
            isVerified: false,
          }),
        });

        if (!websiteResponse.ok) {
          const error = await websiteResponse.json();
          if (error.code === 11000) {
            setFormErrors(prev => ({
              ...prev,
              url: "This tool has already been added. Please search for it instead.",
            }));
            return;
          }
          throw new Error("Failed to create website");
        }

        const website = await websiteResponse.json();
        websiteId = website._id;
      }

      // Create the review
      const reviewResponse = await fetch("/api/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reviewData.title,
          body: reviewData.content,
          rating: reviewData.rating,
          relatedWebsite: websiteId,
          // proof and relatedPlan can be added if needed
        }),
      });

      if (!reviewResponse.ok) {
        throw new Error("Failed to create review");
      }

      // Redirect to the tool page
      router.push(`/tool/${encodeURIComponent(reviewData.url || initialUrl)}`);
    } catch (error) {
      console.error("Error submitting:", error);
      setFormErrors(prev => ({
        ...prev,
        submit: "Failed to submit. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            className={`w-6 h-6 ${
              index <= reviewData.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">{reviewData.title}</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">{reviewData.content}</p>
      </div>

      {reviewData.proofFiles.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Attached Proof</h4>
          <div className="flex flex-wrap gap-2">
            {reviewData.proofFiles.map((file, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground"
              >
                {file.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="bg-secondary/50 backdrop-blur-sm">
      <div className="p-6">
        <div className="space-y-6">
          {/* URL Input for new tools */}
          {isNewTool && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tool URL</label>
                <Input
                  value={reviewData.url}
                  onChange={(e) => setReviewData({ ...reviewData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-background/50"
                />
                {formErrors.url && (
                  <p className="text-sm text-destructive">{formErrors.url}</p>
                )}
              </div>

              {/* Add Tool Name field */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tool Name</label>
                <Input
                  value={reviewData.name}
                  onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
                  placeholder="Enter the tool's name"
                  className="bg-background/50"
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>
            </>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoveredRating(index)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setReviewData({ ...reviewData, rating: index })}
                >
                  <Star
                    className={`w-8 h-8 ${
                      index <= (hoveredRating || reviewData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            {formErrors.rating && (
              <p className="text-sm text-destructive">{formErrors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Review Title</label>
            <Input
              value={reviewData.title}
              onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
              placeholder="Summarize your experience"
              className="bg-background/50"
            />
            {formErrors.title && (
              <p className="text-sm text-destructive">{formErrors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              value={reviewData.content}
              onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
              placeholder="Share your experience with this tool..."
              className="h-32 bg-background/50"
            />
            {formErrors.content && (
              <p className="text-sm text-destructive">{formErrors.content}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {reviewData.content.length}/1000 characters
            </p>
          </div>

          {/* Proof Upload */}
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <h3 className="text-sm font-medium">Verify Your Experience</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Adding proof of your experience helps build trust in your review.
                  Remember to remove any sensitive information before uploading.
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Upload proof of your visit/purchase (optional)
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  • Receipt/invoice<br />
                  • Order confirmation<br />
                  • Photo of your visit<br />
                  • Screenshot of transaction
                </p>
                <input
                  type="file"
                  id="proof"
                  className="hidden"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("proof")?.click()}
                >
                  Choose Files
                </Button>
              </div>
            </div>

            {formErrors.files && (
              <p className="text-sm text-destructive">{formErrors.files}</p>
            )}

            {reviewData.proofFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Uploaded Files</h4>
                <div className="space-y-2">
                  {reviewData.proofFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-background/50 rounded-lg"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex-1"
              disabled={isSubmitting}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 gradient-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>

          {formErrors.submit && (
            <p className="text-sm text-destructive text-center mt-2">
              {formErrors.submit}
            </p>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review Preview</AlertDialogTitle>
            <AlertDialogDescription>
              Here's how your review will appear to others.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            {renderPreview()}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Edit Review
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 