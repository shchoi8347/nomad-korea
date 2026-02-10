"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/cities/filter-sidebar";
import { SortOptions } from "@/components/cities/sort-options";
import { ViewToggle } from "@/components/cities/view-toggle";
import { CityGrid } from "@/components/cities/city-grid";
import { CityList } from "@/components/cities/city-list";
import { mockCities } from "@/lib/mock-data";

export default function CitiesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">도시 찾기</h1>
        <p className="mt-2 text-muted-foreground">
          대한민국 {mockCities.length}개 도시를 둘러보세요
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <FilterSidebar />
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <SortOptions />
            <ViewToggle view={view} onViewChange={setView} />
          </div>

          {view === "grid" ? (
            <CityGrid cities={mockCities} />
          ) : (
            <CityList cities={mockCities} />
          )}
        </div>
      </div>
    </div>
  );
}
