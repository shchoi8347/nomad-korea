'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('로그아웃 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      disabled={loading}
    >
      {loading ? '로그아웃 중...' : '로그아웃'}
    </Button>
  )
}
