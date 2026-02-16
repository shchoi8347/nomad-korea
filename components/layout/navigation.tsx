"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 초기 사용자 상태 확인
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleAuthClick = (type: "login" | "register") => {
    if (user) {
      if (type === "register") {
        toast.warning("이미 회원가입되어 있습니다", {
          description: "현재 로그인 상태입니다. 로그아웃 후 이용해주세요.",
        });
      } else {
        toast.warning("이미 로그인되어 있습니다", {
          description: "현재 로그인 상태입니다. 로그아웃 후 이용해주세요.",
        });
      }
    }
  };

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
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>

          {user ? (
            <>
              <Button variant="outline" onClick={() => handleAuthClick("register")}>
                회원가입
              </Button>
              <Button variant="default" onClick={() => handleAuthClick("login")}>
                로그인
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/register">회원가입</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/login">로그인</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
