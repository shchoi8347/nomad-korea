import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold">노마드코리아</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              홈
            </Link>
            <Link
              href="/cities"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              도시찾기
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              커뮤니티
            </Link>
            <Link
              href="/guide"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              가이드
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="default">로그인</Button>
        </div>
      </div>
    </nav>
  );
}
