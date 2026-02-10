import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeroImageSlider } from "@/components/city-detail/hero-image-slider";
import { MetricsDashboard } from "@/components/city-detail/metrics-dashboard";
import { CafeList } from "@/components/city-detail/cafe-list";
import { ReviewSection } from "@/components/city-detail/review-section";
import { CityCard } from "@/components/cities/city-card";
import {
  getCityById,
  getReviewsByCityId,
  getCafesByCityId,
  mockCities,
} from "@/lib/mock-data";
import { Bookmark, Share2 } from "lucide-react";

export default function CityDetailPage({ params }: { params: { id: string } }) {
  const city = getCityById(params.id);

  if (!city) {
    notFound();
  }

  const reviews = getReviewsByCityId(params.id);
  const cafes = getCafesByCityId(params.id);
  const relatedCities = mockCities.filter((c) => c.id !== params.id).slice(0, 3);

  return (
    <div className="container py-8">
      <HeroImageSlider images={city.images} cityName={city.name} />

      <div className="mt-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">{city.name}</h1>
            <p className="mt-1 text-xl text-muted-foreground">
              {city.nameEn} • {city.region}
            </p>
            <p className="mt-2 text-muted-foreground">{city.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{city.overallRating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">종합 점수</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {city.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button>
            <Bookmark className="mr-2 h-4 w-4" />
            북마크 ({city.bookmarkCount})
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            공유하기
          </Button>
        </div>
      </div>

      <Separator className="my-12" />

      <div>
        <h2 className="mb-6 text-2xl font-bold">주요 지표</h2>
        <MetricsDashboard city={city} />
      </div>

      <Separator className="my-12" />

      <div>
        <h2 className="mb-6 text-2xl font-bold">
          카페 & 코워킹 스페이스 ({cafes.length})
        </h2>
        <CafeList cafes={cafes} />
      </div>

      <Separator className="my-12" />

      <ReviewSection reviews={reviews} />

      <Separator className="my-12" />

      <div>
        <h2 className="mb-6 text-2xl font-bold">비슷한 도시</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedCities.map((relatedCity) => (
            <CityCard key={relatedCity.id} city={relatedCity} />
          ))}
        </div>
      </div>
    </div>
  );
}
