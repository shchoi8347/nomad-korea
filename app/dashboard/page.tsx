import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">대시보드</CardTitle>
            <CardDescription>
              노마드코리아에 오신 것을 환영합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">사용자 정보</h3>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p><strong>이메일:</strong> {user.email}</p>
                <p><strong>가입일:</strong> {new Date(user.created_at).toLocaleDateString('ko-KR')}</p>
                {user.user_metadata?.name && (
                  <p><strong>이름:</strong> {user.user_metadata.name}</p>
                )}
              </div>
            </div>
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
