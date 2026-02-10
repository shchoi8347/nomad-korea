"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortOptions() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">정렬:</span>
      <Select defaultValue="rating">
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">종합점수</SelectItem>
          <SelectItem value="cost-low">생활비 (낮은순)</SelectItem>
          <SelectItem value="cost-high">생활비 (높은순)</SelectItem>
          <SelectItem value="internet">인터넷속도</SelectItem>
          <SelectItem value="reviews">리뷰많은순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
