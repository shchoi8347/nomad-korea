import { Card, CardContent } from "@/components/ui/card";
import { City } from "@/lib/types";

interface MetricsDashboardProps {
  city: City;
}

export function MetricsDashboard({ city }: MetricsDashboardProps) {
  const metrics = [
    {
      icon: "💵",
      label: "월 평균 생활비",
      value: `₩${(city.costOfLiving / 10000).toFixed(0)}만원`,
      description: "숙박, 식비, 교통비 포함",
    },
    {
      icon: "📡",
      label: "인터넷 속도",
      value: `${city.internetSpeed} Mbps`,
      description: "평균 다운로드 속도",
    },
    {
      icon: "👮",
      label: "안전도",
      value: `${city.safetyScore.toFixed(1)}/5.0`,
      description: "범죄율 및 안전지수",
    },
    {
      icon: "🌡️",
      label: "현재 날씨",
      value: `${city.currentWeather.temp}°C`,
      description: city.currentWeather.condition,
    },
    {
      icon: "💨",
      label: "공기질",
      value: `AQI ${city.airQuality.aqi}`,
      description: city.airQuality.level,
    },
    {
      icon: "☕",
      label: "카페/코워킹",
      value: `${city.metrics.cafeCount + city.metrics.coworkingCount}개`,
      description: "작업 가능한 장소",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="mb-2 text-3xl">{metric.icon}</div>
            <div className="mb-1 text-sm text-muted-foreground">
              {metric.label}
            </div>
            <div className="mb-1 text-2xl font-bold">{metric.value}</div>
            <div className="text-xs text-muted-foreground">
              {metric.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
