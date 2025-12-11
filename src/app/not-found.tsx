'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        404
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Sayfa Bulunamadı
                    </h2>
                    <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400">
                        Aradığınız sayfayı bulamadık. Silinmiş veya taşınmış olabilir.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/"
                            className="rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105"
                        >
                            Ana Sayfaya Dön
                        </Link>
                        <Link href="/iletisim" className="text-sm font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Destek Al <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
