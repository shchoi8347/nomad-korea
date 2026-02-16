"use client";

import { Button } from "@/components/ui/button";
import type { BudgetRange, Region, Environment, BestSeason } from "@/lib/types";

interface FilterSectionProps {
  selectedBudget: BudgetRange | null;
  selectedRegion: Region | null;
  selectedEnvironment: Environment | null;
  selectedSeason: BestSeason | null;
  onBudgetChange: (budget: BudgetRange | null) => void;
  onRegionChange: (region: Region | null) => void;
  onEnvironmentChange: (environment: Environment | null) => void;
  onSeasonChange: (season: BestSeason | null) => void;
  onReset: () => void;
}

export function FilterSection({
  selectedBudget,
  selectedRegion,
  selectedEnvironment,
  selectedSeason,
  onBudgetChange,
  onRegionChange,
  onEnvironmentChange,
  onSeasonChange,
  onReset,
}: FilterSectionProps) {
  // 옵션 정의
  const budgetOptions: BudgetRange[] = ["100만원 이하", "100~200만원", "200만원 이상"];
  const regionOptions: Region[] = ["수도권", "경상도", "전라도", "강원도", "제주도", "충청도"];
  const environmentOptions: Environment[] = ["자연친화", "도심선호", "카페작업", "코워킹 필수"];
  const seasonOptions: BestSeason[] = ["봄", "여름", "가을", "겨울"];

  // 필터 토글 핸들러
  const toggleFilter = <T,>(selected: T | null, item: T, onChange: (value: T | null) => void) => {
    if (selected === item) {
      onChange(null); // 같은 항목 재클릭 시 선택 해제
    } else {
      onChange(item); // 새로운 항목 선택
    }
  };

  // 선택된 필터 개수 계산
  const totalFilters =
    (selectedBudget ? 1 : 0) +
    (selectedRegion ? 1 : 0) +
    (selectedEnvironment ? 1 : 0) +
    (selectedSeason ? 1 : 0);

  return (
    <section className="border-b bg-muted/30 py-6">
      <div className="container">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            필터 {totalFilters > 0 && `(${totalFilters})`}
          </h3>
          {totalFilters > 0 && (
            <Button variant="outline" size="sm" onClick={onReset}>
              초기화
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* 예산 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">💵 예산</h4>
            <div className="flex flex-wrap gap-2">
              {budgetOptions.map((budget) => (
                <Button
                  key={budget}
                  variant={selectedBudget === budget ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedBudget, budget, onBudgetChange)}
                >
                  {budget}
                </Button>
              ))}
            </div>
          </div>

          {/* 지역 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">📍 지역</h4>
            <div className="flex flex-wrap gap-2">
              {regionOptions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedRegion, region, onRegionChange)}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>

          {/* 환경 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">🌿 환경</h4>
            <div className="flex flex-wrap gap-2">
              {environmentOptions.map((env) => (
                <Button
                  key={env}
                  variant={selectedEnvironment === env ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedEnvironment, env, onEnvironmentChange)}
                >
                  {env}
                </Button>
              ))}
            </div>
          </div>

          {/* 계절 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">🍂 최고 계절</h4>
            <div className="flex flex-wrap gap-2">
              {seasonOptions.map((season) => (
                <Button
                  key={season}
                  variant={selectedSeason === season ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedSeason, season, onSeasonChange)}
                >
                  {season}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
