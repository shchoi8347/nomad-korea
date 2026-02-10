import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">🏠 노마드코리아</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-muted-foreground hover:text-foreground">
                  팀
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  채용
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  문의
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">📚 가이드</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guide/start" className="text-muted-foreground hover:text-foreground">
                  시작 가이드
                </Link>
              </li>
              <li>
                <Link href="/guide/visa" className="text-muted-foreground hover:text-foreground">
                  비자 정보
                </Link>
              </li>
              <li>
                <Link href="/guide/housing" className="text-muted-foreground hover:text-foreground">
                  숙소 찾기
                </Link>
              </li>
              <li>
                <Link href="/guide/apps" className="text-muted-foreground hover:text-foreground">
                  필수 앱
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">💬 커뮤니티</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/community/board" className="text-muted-foreground hover:text-foreground">
                  도시 게시판
                </Link>
              </li>
              <li>
                <Link href="/community/qna" className="text-muted-foreground hover:text-foreground">
                  Q&A
                </Link>
              </li>
              <li>
                <Link href="/community/meetup" className="text-muted-foreground hover:text-foreground">
                  밋업
                </Link>
              </li>
              <li>
                <Link href="/community/blog" className="text-muted-foreground hover:text-foreground">
                  블로그
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">ℹ️ 정보</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/notice" className="text-muted-foreground hover:text-foreground">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  개인정보
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>SNS:</span>
            <Link href="#" className="hover:text-foreground">
              인스타그램
            </Link>
            <Link href="#" className="hover:text-foreground">
              페이스북
            </Link>
            <Link href="#" className="hover:text-foreground">
              유튜브
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>© 2024 노마드코리아. All rights reserved.</p>
            <p className="mt-1">서울특별시 강남구 테헤란로 123 | contact@nomadkorea.com</p>
            <p className="mt-1">Made with ❤️ by Digital Nomads</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
