import { CityCard } from "./city-card";
import { City } from "@/lib/types";

interface CityGridProps {
  cities: City[];
}

export function CityGrid({ cities }: CityGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cities.map((city) => (
        <CityCard key={city.id} city={city} />
      ))}
    </div>
  );
}
