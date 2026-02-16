"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export function SearchBar({ searchQuery, onSearchChange, resultCount }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="도시 이름으로 검색..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
      {searchQuery && (
        <p className="mt-2 text-sm text-muted-foreground">
          "{searchQuery}" 검색 결과: {resultCount}개 도시
        </p>
      )}
    </div>
  );
}
