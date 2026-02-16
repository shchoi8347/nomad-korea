export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="container py-8">
        {/* 제목 스켈레톤 */}
        <div className="h-12 w-64 bg-muted animate-pulse rounded mb-4" />
        <div className="h-7 w-48 bg-muted animate-pulse rounded mb-6" />

        <div className="space-y-4">
          {/* 기본 정보 스켈레톤 */}
          <div className="rounded-lg border p-6">
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* 날씨 정보 스켈레톤 */}
          <div className="rounded-lg border p-6">
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4" />
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-7 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* 대기질 스켈레톤 */}
          <div className="rounded-lg border p-6">
            <div className="h-8 w-24 bg-muted animate-pulse rounded mb-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-7 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* 메트릭 스켈레톤 */}
          <div className="rounded-lg border p-6">
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-7 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
