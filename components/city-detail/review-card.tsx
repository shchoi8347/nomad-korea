import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start gap-4">
          <Avatar>
            <AvatarImage src={review.userAvatar} alt={review.userName} />
            <AvatarFallback>{review.userName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold">{review.userName}</span>
              {review.isVerified && (
                <Badge variant="secondary">✓ 인증</Badge>
              )}
              <span className="text-sm text-muted-foreground">
                📅 {review.createdAt}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {review.occupation} • {review.stayDuration} 체류
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1">
              {"⭐".repeat(Math.floor(review.overallRating))}
            </div>
            <div className="text-lg font-bold">{review.overallRating.toFixed(1)}</div>
          </div>
        </div>

        <p className="mb-4 text-muted-foreground">{review.content}</p>

        {review.images.length > 0 && (
          <div className="mb-4 flex gap-2">
            {review.images.map((image, index) => (
              <div
                key={index}
                className="relative h-24 w-24 overflow-hidden rounded-lg"
              >
                <Image src={image} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 grid grid-cols-4 gap-2 rounded-lg border p-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">생활비</div>
            <div className="font-medium">{review.ratings.costSatisfaction}/5</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">인터넷</div>
            <div className="font-medium">{review.ratings.internetQuality}/5</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">업무환경</div>
            <div className="font-medium">{review.ratings.workEnvironment}/5</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">자연</div>
            <div className="font-medium">{review.ratings.nature}/5</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            👍 도움됨 {review.helpfulCount}
          </Button>
          <Button variant="outline" size="sm">
            💬 댓글 {review.commentCount}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
