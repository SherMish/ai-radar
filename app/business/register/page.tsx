"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';

type LoadingState = {
  logo: boolean;
  features: boolean;
};

type BusinessData = {
  logo: File | null;
  logoPreview: string;
  features: Array<{
    id: string;
    title: string;
    description: string;
  }>;
};

type FormErrors = {
  logo?: string;
  features?: string;
  [key: string]: string | undefined;
};

export default function BusinessRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    logo: false,
    features: false
  });
  const [businessData, setBusinessData] = useState<BusinessData>({
    logo: null,
    logoPreview: "",
    features: []
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(prev => ({ ...prev, logo: true }));
    try {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        throw new Error("Please upload a PNG or JPG file");
      }

      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must be less than 2MB");
      }

      // Process image
      const reader = new FileReader();
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setBusinessData(prev => ({
        ...prev,
        logo: file,
        logoPreview: reader.result as string
      }));
      setFormErrors(prev => ({ ...prev, logo: "" }));
    } catch (error) {
      setFormErrors(prev => ({
        ...prev,
        logo: error instanceof Error ? error.message : "Failed to upload logo"
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, logo: false }));
    }
  };

  const handleAddFeature = (title: string, description: string) => {
    if (businessData.features.length >= 10) {
      setFormErrors(prev => ({
        ...prev,
        features: "Maximum of 10 features allowed"
      }));
      return;
    }

    if (title.length > 30) {
      setFormErrors(prev => ({
        ...prev,
        features: "Feature title must be 30 characters or less"
      }));
      return;
    }

    setBusinessData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        {
          id: Math.random().toString(36).substr(2, 9),
          title,
          description
        }
      ]
    }));
    setFormErrors(prev => ({ ...prev, features: "" }));
  };

  const handleRemoveFeature = (id: string) => {
    setBusinessData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature.id !== id)
    }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      router.push("/business/pricing");
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Logo Section */}
      <section className="space-y-4" aria-labelledby="logo-section">
        <div className="flex items-center justify-between">
          <h3 id="logo-section" className="text-sm font-medium">Business Logo</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => {
              setBusinessData(prev => ({ ...prev, logo: null, logoPreview: "" }));
              setFormErrors(prev => ({ ...prev, logo: "" }));
            }}
            disabled={isLoading.logo}
          >
            Reset
          </Button>
        </div>

        {/* Logo Guidelines - Progressive Disclosure */}
        <details className="group bg-secondary/50 rounded-lg">
          <summary className="p-4 cursor-pointer list-none">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Logo Guidelines</p>
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
            </div>
          </summary>
          <div className="px-4 pb-4">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                File formats: PNG or JPG/JPEG
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Maximum file size: 2MB
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Recommended size: 400x400 pixels
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Square aspect ratio recommended
              </li>
            </ul>
          </div>
        </details>

        {/* Logo Upload Area */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div 
            className={`w-full sm:w-40 h-40 border-2 ${
              isLoading.logo ? 'border-primary' : 'border-dashed'
            } border-border rounded-lg flex items-center justify-center relative overflow-hidden`}
          >
            {isLoading.logo ? (
              <div className="animate-pulse bg-secondary/50 w-full h-full" />
            ) : businessData.logoPreview ? (
              <>
                <Image
                  src={businessData.logoPreview}
                  alt="Logo preview"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setBusinessData(prev => ({ 
                    ...prev, 
                    logo: null, 
                    logoPreview: "" 
                  }))}
                >
                  ×
                </Button>
              </>
            ) : (
              <label className="cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Drop logo here or click to upload
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleLogoChange}
                  disabled={isLoading.logo}
                  aria-label="Upload business logo"
                />
              </label>
            )}
          </div>
        </div>
        {formErrors.logo && (
          <p className="text-sm text-destructive" role="alert">
            {formErrors.logo}
          </p>
        )}
      </section>

      {/* Features Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Key Features</h3>
          <span className="text-sm text-muted-foreground">
            {businessData.features.length}/10 features
          </span>
        </div>

        <div className="space-y-4">
          {businessData.features.map((feature, index) => (
            <div
              key={feature.id}
              className="p-4 bg-secondary/50 rounded-lg border border-border"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {feature.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFeature(feature.id)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}

          {businessData.features.length < 10 && (
            <div className="p-4 border border-dashed border-border rounded-lg space-y-4">
              <Input
                placeholder="Feature title (max 30 chars)"
                maxLength={30}
                className="bg-background/50"
              />
              <Textarea
                placeholder="Feature description"
                className="bg-background/50"
              />
              <Button onClick={() => handleAddFeature("Sample Title", "Sample Description")}>
                Add Feature
              </Button>
            </div>
          )}
        </div>
        {formErrors.features && (
          <p className="text-sm text-destructive" role="alert">
            {formErrors.features}
          </p>
        )}
      </section>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
      case 1:
      case 2:
        // Keep existing step renders
        return null;
      case 3:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {renderStep()}
          
          <div className="mt-8 flex justify-end gap-4">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            <Button
              className="gradient-button"
              onClick={handleNext}
            >
              {currentStep === 3 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}