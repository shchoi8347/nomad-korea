import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { City } from "@/lib/types";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/cities/${city.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={city.images[0]}
            alt={city.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {city.rank && city.rank <= 3 && (
            <Badge className="absolute left-3 top-3 bg-orange-500">
              {city.rank === 1 ? "🔥 #1" : `⭐ #${city.rank}`}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">{city.name}</h3>
            <p className="text-sm text-muted-foreground">{city.nameEn}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                ⭐ {city.overallRating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                💵 ₩{(city.costOfLiving / 10000).toFixed(0)}만
              </span>
              <span className="flex items-center gap-1">
                📡 {city.internetSpeed}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                🌡️ {city.currentWeather.temp}°C
              </span>
              <span>
                💨 {city.airQuality.level}
              </span>
            </div>

            <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
              <span>💬 {city.reviewCount}</span>
              <span>👁️ {(city.bookmarkCount / 100).toFixed(1)}K</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
