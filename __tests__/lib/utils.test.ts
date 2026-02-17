import { cn } from '@/lib/utils'

describe('cn()', () => {
  it('단일 클래스를 그대로 반환한다', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('다중 클래스를 공백으로 병합한다', () => {
    expect(cn('text-sm', 'font-bold', 'mt-4')).toBe('text-sm font-bold mt-4')
  })

  it('falsy 값(false, null, undefined)을 무시한다', () => {
    expect(cn('text-sm', false, null, undefined, 'font-bold')).toBe('text-sm font-bold')
  })

  it('조건부 클래스를 올바르게 처리한다 (true → 포함, false → 제외)', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base-class', isActive && 'active', isDisabled && 'disabled')).toBe('base-class active')
  })

  it('Tailwind padding 충돌을 해결한다 (p-4 + p-8 → p-8)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  it('Tailwind text-color 충돌을 해결한다 (text-red-500 + text-blue-500 → text-blue-500)', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('인자 없이 호출하면 빈 문자열을 반환한다', () => {
    expect(cn()).toBe('')
  })
})
