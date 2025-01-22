"use client";

import ReviewForm from "@/components/review/review-form";
import ReviewLayout from "@/components/review/review-layout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function NewToolPage() {
  // For development - skip auth check
  // const session = await getServerSession(authOptions);
  // if (!session?.user) {
  //   redirect("/api/auth/signin?callbackUrl=/tool/new");
  // }

  return (
    <ReviewLayout title="Add a New AI Tool">
      <ReviewForm isNewTool={true} />
    </ReviewLayout>
  );
} 