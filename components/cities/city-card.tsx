import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { City } from "@/lib/types";
import { LikeDislikeButtons } from "@/components/ui/like-dislike-buttons";

interface CityCardProps {
  city: City;
  initialUserAction?: "like" | "dislike" | null;
  onLikeUpdate?: (
    cityId: string,
    newLikes: number,
    newDislikes: number,
    newUserAction: "like" | "dislike" | null
  ) => void;
}

export function CityCard({ city, initialUserAction = null, onLikeUpdate }: CityCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:scale-105">
      {/* 이미지 + 도시 정보 → Link로 감싸서 클릭 시 상세 페이지 이동 */}
      <Link href={`/cities/${city.id}`} className="block cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={city.images[0]}
            alt={city.name}
            fill
            className="object-cover transition-transform"
          />
          {city.rank && city.rank <= 3 && (
            <Badge className="absolute left-3 top-3 bg-orange-500">
              {city.rank === 1 ? "🔥 #1" : `⭐ #${city.rank}`}
            </Badge>
          )}
        </div>

        <CardContent className="p-4 pb-2">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">{city.name}</h3>
            <p className="text-sm text-muted-foreground">{city.nameEn}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">예산</span>
              <span className="font-medium">{city.budgetRange}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">지역</span>
              <span className="font-medium">{city.region}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">환경</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {city.environments.map((env) => (
                  <Badge key={env} variant="secondary" className="text-xs">
                    {env}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">최고 계절</span>
              <span className="font-medium">{city.bestSeason}</span>
            </div>
          </div>
        </CardContent>
      </Link>

      {/* 좋아요/싫어요 + 통계 → Link 밖에 위치해야 클릭 시 이동하지 않음 */}
      <div className="px-4 pb-4">
        <div className="border-t pt-2">
          <LikeDislikeButtons
            cityId={city.id}
            initialLikes={city.likes}
            initialDislikes={city.dislikes}
            initialUserAction={initialUserAction}
            onUpdate={
              onLikeUpdate
                ? (likes, dislikes, userAction) =>
                    onLikeUpdate(city.id, likes, dislikes, userAction)
                : undefined
            }
          />
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>💬 {city.reviewCount}</span>
          <span>👁️ {(city.bookmarkCount / 100).toFixed(1)}K</span>
        </div>
      </div>
    </Card>
  );
}
