import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CityCard } from "@/components/cities/city-card";
import { getTopCities } from "@/lib/mock-data";

export function PopularCities() {
  const topCities = getTopCities(8);

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">🔥 이번 달 인기 도시 TOP 10</h2>
            <p className="mt-2 text-muted-foreground">
              가장 많은 노마드들이 선택한 도시
            </p>
          </div>
          <Link href="/cities">
            <Button variant="outline">전체보기 →</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
