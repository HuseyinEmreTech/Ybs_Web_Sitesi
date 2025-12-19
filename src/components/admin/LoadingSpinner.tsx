export default function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin`} />
    </div>
  )
}

