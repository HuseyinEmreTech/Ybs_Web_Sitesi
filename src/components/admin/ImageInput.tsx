'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    helpText?: string
}

export default function ImageInput({ label, value, onChange, placeholder, helpText }: ImageInputProps) {
    const [previewError, setPreviewError] = useState(false)

    // Reset error when value changes
    useEffect(() => {
        setPreviewError(false)
    }, [value])

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>

            <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1 w-full">
                    <input
                        type="url"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder={placeholder || "https://example.com/image.jpg"}
                    />
                    {helpText && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                            {helpText}
                        </p>
                    )}
                </div>

                {/* Preview Box - Only show if value exists */}
                {value && (
                    <div className="relative shrink-0 w-full md:w-32 aspect-video md:aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden group">
                        {previewError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-red-500 bg-red-50 dark:bg-red-900/10">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                <span className="text-[10px] font-medium">Yüklenemedi</span>
                            </div>
                        ) : (
                            <Image
                                src={value}
                                alt="Önizleme"
                                fill
                                onError={() => setPreviewError(true)}
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                unoptimized // Previews don't need optimization/caching as much as stability
                            />
                        )}

                        {/* Status Valid Indicator */}
                        {!previewError && (
                            <div className="absolute bottom-1 right-1 bg-green-500 text-white p-0.5 rounded-full shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
