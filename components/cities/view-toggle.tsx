"use client";

import { Button } from "@/components/ui/button";
import { Grid3x3, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
      >
        <Grid3x3 className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
