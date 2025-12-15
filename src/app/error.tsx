'use client'

import { useEffect } from 'react'
import Button from '@/components/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-8 shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    Bir Şeyler Ters Gitti!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyebilirsiniz.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => reset()}
                        className="bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Tekrar Dene
                    </Button>
                    <Button
                        href="/"
                        variant="outline"
                    >
                        Ana Sayfa
                    </Button>
                </div>
            </div>
        </div>
    )
}
