import { getCityById } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const city = await getCityById(id);

  if (!city) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-4">{city.name}</h1>
        <p className="text-xl text-muted-foreground mb-6">{city.nameEn}</p>

        <div className="space-y-4">
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">기본 정보</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">전체 평점</p>
                <p className="text-2xl font-bold">{city.overallRating}/5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">생활비</p>
                <p className="text-2xl font-bold">{city.costOfLiving.toLocaleString()}원/월</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">인터넷 속도</p>
                <p className="text-2xl font-bold">{city.internetSpeed}Mbps</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">현재 날씨</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">기온</p>
                <p className="text-xl font-bold">{city.currentWeather.temp}°C</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">체감온도</p>
                <p className="text-xl font-bold">{city.currentWeather.feelsLike}°C</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">날씨</p>
                <p className="text-xl font-bold">{city.currentWeather.condition}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">대기질</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">AQI 지수</p>
                <p className="text-xl font-bold">{city.airQuality.aqi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">등급</p>
                <p className="text-xl font-bold">{city.airQuality.level}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">도시 메트릭</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">카페 수</p>
                <p className="text-xl font-bold">{city.metrics.cafeCount}개</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">코워킹 수</p>
                <p className="text-xl font-bold">{city.metrics.coworkingCount}개</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">교통 점수</p>
                <p className="text-xl font-bold">{city.metrics.transportScore}/10</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">문화 점수</p>
                <p className="text-xl font-bold">{city.metrics.cultureScore}/10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
