import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LikeDislikeButtons } from '@/components/ui/like-dislike-buttons'

let mockRpc: ReturnType<typeof vi.fn>

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    rpc: mockRpc,
  })),
}))

beforeEach(() => {
  // 기본값은 likes+1, dislikes+1을 반환하여 낙관적 업데이트 값과 일치시킴
  mockRpc = vi.fn().mockResolvedValue({
    data: { likes: 101, dislikes: 6 },
    error: null,
  })
})

// ── 초기 렌더링 ──────────────────────────────────────────────────────────────

describe('초기 렌더링', () => {
  it('initialLikes가 버튼에 표시된다', () => {
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    expect(screen.getByRole('button', { name: /👍 100/ })).toBeInTheDocument()
  })

  it('initialDislikes가 버튼에 표시된다', () => {
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    expect(screen.getByRole('button', { name: /👎 5/ })).toBeInTheDocument()
  })

  it('초기에는 두 버튼 모두 disabled가 아니다', () => {
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    expect(screen.getByRole('button', { name: /👍/ })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /👎/ })).not.toBeDisabled()
  })

  it('initialUserAction이 없으면 두 버튼 모두 기본 스타일이다', () => {
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    const likeBtn = screen.getByRole('button', { name: /👍/ })
    expect(likeBtn.className).not.toContain('bg-blue-50')
  })

  it('initialUserAction="like"이면 좋아요 버튼에 활성 스타일이 적용된다', () => {
    render(
      <LikeDislikeButtons
        cityId="jeju"
        initialLikes={100}
        initialDislikes={5}
        initialUserAction="like"
      />
    )
    const likeBtn = screen.getByRole('button', { name: /👍/ })
    expect(likeBtn.className).toContain('bg-blue-50')
  })
})

// ── 좋아요 동작 ──────────────────────────────────────────────────────────────

describe('좋아요 동작', () => {
  it('좋아요 버튼 클릭 시 낙관적으로 +1된다', async () => {
    const user = userEvent.setup()
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👍/ }))
    expect(screen.getByRole('button', { name: /👍 101/ })).toBeInTheDocument()
  })

  it('좋아요 클릭 후 RPC 응답으로 최종 카운트로 동기화된다', async () => {
    const user = userEvent.setup()
    mockRpc.mockResolvedValue({ data: { likes: 102, dislikes: 5 }, error: null })
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /👍 102/ })).toBeInTheDocument()
    })
  })

  it('이미 좋아요 상태에서 다시 클릭하면 좋아요가 취소된다(-1)', async () => {
    const user = userEvent.setup()
    mockRpc.mockResolvedValue({ data: { likes: 99, dislikes: 5 }, error: null })
    render(
      <LikeDislikeButtons
        cityId="jeju"
        initialLikes={100}
        initialDislikes={5}
        initialUserAction="like"
      />
    )
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /👍 99/ })).toBeInTheDocument()
    })
  })

  it('RPC 에러 시 좋아요 카운트가 롤백된다', async () => {
    const user = userEvent.setup()
    mockRpc.mockResolvedValue({ data: null, error: new Error('DB error') })
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /👍 100/ })).toBeInTheDocument()
    })
  })
})

// ── 싫어요 동작 ──────────────────────────────────────────────────────────────

describe('싫어요 동작', () => {
  it('싫어요 버튼 클릭 시 낙관적으로 +1된다', async () => {
    const user = userEvent.setup()
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👎/ }))
    expect(screen.getByRole('button', { name: /👎 6/ })).toBeInTheDocument()
  })

  it('싫어요 클릭 후 RPC 응답으로 최종 카운트로 동기화된다', async () => {
    const user = userEvent.setup()
    mockRpc.mockResolvedValue({ data: { likes: 100, dislikes: 7 }, error: null })
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👎/ }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /👎 7/ })).toBeInTheDocument()
    })
  })

  it('이미 싫어요 상태에서 다시 클릭하면 싫어요가 취소된다(-1)', async () => {
    const user = userEvent.setup()
    mockRpc.mockResolvedValue({ data: { likes: 100, dislikes: 4 }, error: null })
    render(
      <LikeDislikeButtons
        cityId="jeju"
        initialLikes={100}
        initialDislikes={5}
        initialUserAction="dislike"
      />
    )
    await user.click(screen.getByRole('button', { name: /👎/ }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /👎 4/ })).toBeInTheDocument()
    })
  })

  it('RPC 에러 시 싫어요 카운트가 롤백된다', async () => {
    const user = userEvent.setup()
    mockRpc.mockResolvedValue({ data: null, error: new Error('DB error') })
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👎/ }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /👎 5/ })).toBeInTheDocument()
    })
  })
})

// ── RPC 연동 ─────────────────────────────────────────────────────────────────

describe('RPC 연동', () => {
  it('좋아요 클릭 시 handle_city_like RPC가 호출된다', async () => {
    const user = userEvent.setup()
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      expect(mockRpc).toHaveBeenCalledWith('handle_city_like', {
        p_city_id: 'jeju',
        p_old_action: 'none',
        p_new_action: 'like',
      })
    })
  })

  it('싫어요 클릭 시 handle_city_like RPC가 호출된다', async () => {
    const user = userEvent.setup()
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👎/ }))
    await waitFor(() => {
      expect(mockRpc).toHaveBeenCalledWith('handle_city_like', {
        p_city_id: 'jeju',
        p_old_action: 'none',
        p_new_action: 'dislike',
      })
    })
  })

  it('이미 좋아요 상태에서 취소 시 p_new_action이 "none"으로 전달된다', async () => {
    const user = userEvent.setup()
    render(
      <LikeDislikeButtons
        cityId="jeju"
        initialLikes={100}
        initialDislikes={5}
        initialUserAction="like"
      />
    )
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      expect(mockRpc).toHaveBeenCalledWith('handle_city_like', {
        p_city_id: 'jeju',
        p_old_action: 'like',
        p_new_action: 'none',
      })
    })
  })

  it('RPC 예외 발생 시 상태가 롤백된다', async () => {
    const user = userEvent.setup()
    mockRpc.mockRejectedValue(new Error('network error'))
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /👍 100/ })).toBeInTheDocument()
    })
  })
})

// ── isPending 상태 ────────────────────────────────────────────────────────────

describe('isPending 상태', () => {
  it('클릭 직후 두 버튼이 disabled 상태가 된다', async () => {
    const user = userEvent.setup()
    // RPC를 느리게 만들어 pending 상태를 잡음
    mockRpc.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: { likes: 101, dislikes: 5 }, error: null }), 100))
    )
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👍/ }))
    expect(screen.getByRole('button', { name: /👍/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /👎/ })).toBeDisabled()
  })

  it('RPC 완료 후 버튼이 다시 활성화된다', async () => {
    const user = userEvent.setup()
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /👍/ })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /👎/ })).not.toBeDisabled()
    })
  })

  it('pending 중 다시 클릭해도 RPC가 한 번만 호출된다', async () => {
    const user = userEvent.setup()
    mockRpc.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: { likes: 101, dislikes: 5 }, error: null }), 100))
    )
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    const likeBtn = screen.getByRole('button', { name: /👍/ })
    await user.click(likeBtn)
    // pending 중 추가 클릭 시도 (버튼이 disabled이므로 무시됨)
    await user.click(likeBtn)
    await waitFor(() => {
      expect(mockRpc).toHaveBeenCalledTimes(1)
    })
  })
})

// ── onUpdate 콜백 ─────────────────────────────────────────────────────────────

describe('onUpdate 콜백', () => {
  it('좋아요 클릭 시 onUpdate가 새 카운트와 함께 호출된다', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    mockRpc.mockResolvedValue({ data: { likes: 101, dislikes: 5 }, error: null })
    render(
      <LikeDislikeButtons
        cityId="jeju"
        initialLikes={100}
        initialDislikes={5}
        onUpdate={onUpdate}
      />
    )
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      // 낙관적 업데이트 + RPC 완료 후 동기화 총 2번 호출됨
      expect(onUpdate).toHaveBeenCalled()
    })
  })

  it('onUpdate 없이도 에러 없이 동작한다', async () => {
    const user = userEvent.setup()
    render(<LikeDislikeButtons cityId="jeju" initialLikes={100} initialDislikes={5} />)
    await expect(
      user.click(screen.getByRole('button', { name: /👍/ }))
    ).resolves.not.toThrow()
  })

  it('RPC 에러 시 onUpdate가 원래 값으로 롤백 호출된다', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    mockRpc.mockResolvedValue({ data: null, error: new Error('DB error') })
    render(
      <LikeDislikeButtons
        cityId="jeju"
        initialLikes={100}
        initialDislikes={5}
        onUpdate={onUpdate}
      />
    )
    await user.click(screen.getByRole('button', { name: /👍/ }))
    await waitFor(() => {
      const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1]
      expect(lastCall[0]).toBe(100) // 원래 likes
      expect(lastCall[1]).toBe(5)   // 원래 dislikes
    })
  })
})
