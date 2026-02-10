import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { City } from "@/lib/types";

interface CityListProps {
  cities: City[];
}

export function CityList({ cities }: CityListProps) {
  return (
    <div className="space-y-4">
      {cities.map((city) => (
        <Link key={city.id} href={`/cities/${city.id}`}>
          <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <div className="flex gap-4 p-4">
              <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={city.images[0]}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {city.rank && city.rank <= 3 && (
                  <Badge className="absolute left-2 top-2 bg-orange-500">
                    {city.rank === 1 ? "🔥 #1" : `⭐ #${city.rank}`}
                  </Badge>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{city.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {city.nameEn} • {city.region}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span className="text-lg font-bold">
                          {city.overallRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {city.description}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4 border-t pt-3">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">생활비</div>
                    <div className="font-medium">
                      ₩{(city.costOfLiving / 10000).toFixed(0)}만
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">인터넷</div>
                    <div className="font-medium">{city.internetSpeed} Mbps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">날씨</div>
                    <div className="font-medium">{city.currentWeather.temp}°C</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">공기질</div>
                    <div className="font-medium">{city.airQuality.level}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
