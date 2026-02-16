"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 예산 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">💵 예산</h4>
            <Select
              value={selectedBudget ?? "all"}
              onValueChange={(value) => {
                onBudgetChange(value === "all" ? null : (value as BudgetRange));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="예산을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {budgetOptions.map((budget) => (
                  <SelectItem key={budget} value={budget}>
                    {budget}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 지역 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">📍 지역</h4>
            <Select
              value={selectedRegion ?? "all"}
              onValueChange={(value) => {
                onRegionChange(value === "all" ? null : (value as Region));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {regionOptions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 환경 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">🌿 환경</h4>
            <Select
              value={selectedEnvironment ?? "all"}
              onValueChange={(value) => {
                onEnvironmentChange(value === "all" ? null : (value as Environment));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="환경을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {environmentOptions.map((env) => (
                  <SelectItem key={env} value={env}>
                    {env}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 계절 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">🍂 최고 계절</h4>
            <Select
              value={selectedSeason ?? "all"}
              onValueChange={(value) => {
                onSeasonChange(value === "all" ? null : (value as BestSeason));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="계절을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {seasonOptions.map((season) => (
                  <SelectItem key={season} value={season}>
                    {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
