"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Upload, Eye, ArrowLeft, AlertCircle } from "lucide-react";
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
  rating: number;
  title: string;
  content: string;
  proofFiles: File[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export default function WriteReviewPage({ 
  params 
}: { 
  params: { url: string } 
}) {
  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 0,
    title: "",
    content: "",
    proofFiles: [],
  });

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

  const handleSubmit = () => {
    if (!validateForm()) return;
    // Handle submission logic here
    router.push(`/tool/${params.url}`);
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
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="bg-secondary/50 backdrop-blur-sm">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Write a Review</h1>

              <div className="space-y-6">
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
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 gradient-button"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          </Card>
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
            <AlertDialogCancel>Edit Review</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit Review</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}