"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "likes-desc" | "likes-asc" | "name-asc" | "name-desc";

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortDropdown({ sortBy, onSortChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">정렬:</span>
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="likes-desc">👍 좋아요 많은 순</SelectItem>
          <SelectItem value="likes-asc">👍 좋아요 적은 순</SelectItem>
          <SelectItem value="name-asc">🔤 이름 오름차순</SelectItem>
          <SelectItem value="name-desc">🔤 이름 내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
