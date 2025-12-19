'use client'

import { Component, ReactNode } from 'react'
import { logger } from '@/lib/logger'
import Button from '@/components/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-8 shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Bir Hata Oluştu
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {this.state.error?.message || 'Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sayfayı Yenile
              </Button>
              <Button
                href="/admin"
                variant="outline"
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

