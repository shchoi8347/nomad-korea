import { Button } from "@/components/ui/button";
import { ReviewCard } from "./review-card";
import { Review } from "@/lib/types";

interface ReviewSectionProps {
  reviews: Review[];
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">리뷰 ({reviews.length})</h2>
          <p className="text-sm text-muted-foreground">
            실제 노마드들의 경험담
          </p>
        </div>
        <Button>리뷰 작성하기</Button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
        </div>
      )}
    </div>
  );
}
