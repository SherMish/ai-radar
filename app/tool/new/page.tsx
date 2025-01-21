import ReviewForm from "@/components/review/review-form";
import ReviewLayout from "@/components/review/review-layout";

export default function NewToolPage() {
  return (
    <ReviewLayout title="Add a New AI Tool">
      <ReviewForm isNewTool={true} />
    </ReviewLayout>
  );
} 