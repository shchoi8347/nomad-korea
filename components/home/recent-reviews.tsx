import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Review } from "@/lib/types";

interface RecentReviewsProps {
  reviews: Review[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  const recentReviews = reviews;

  return (
    <section className="bg-muted/40 py-16">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">💬 최근 노마드들의 생생한 후기</h2>
          <p className="mt-2 text-muted-foreground">
            실제 경험담을 확인하세요
          </p>
        </div>

        {recentReviews.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            아직 작성된 후기가 없습니다. 첫 번째 후기를 남겨보세요!
          </p>
        )}

        <div className="space-y-4">
          {recentReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.userAvatar} alt={review.userName} />
                    <AvatarFallback>{review.userName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.userName}</span>
                      <span className="text-sm text-muted-foreground">|</span>
                      <span className="text-sm text-muted-foreground">
                        {review.cityName}
                      </span>
                      <span className="text-sm text-muted-foreground">|</span>
                      <span className="text-sm text-muted-foreground">
                        {review.createdAt}
                      </span>
                      {review.isVerified && (
                        <Badge variant="secondary">인증</Badge>
                      )}
                    </div>

                    <p className="mt-3 text-muted-foreground">{review.content}</p>

                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>👍 도움됨 {review.helpfulCount}</span>
                      <span>💬 댓글 {review.commentCount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
