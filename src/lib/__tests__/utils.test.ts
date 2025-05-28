import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
  })

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class')
    expect(cn('base-class', false && 'conditional-class')).toBe('base-class')
  })

  it('should handle objects', () => {
    expect(cn({ 'active': true, 'inactive': false })).toBe('active')
  })

  it('should handle arrays', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
  })

  it('should merge tailwind classes correctly', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null)).toBe('')
    expect(cn(undefined)).toBe('')
  })

  it('should handle mixed inputs', () => {
    expect(cn('base', { 'conditional': true }, ['array-class'], 'final')).toBe('base conditional array-class final')
  })
}) 