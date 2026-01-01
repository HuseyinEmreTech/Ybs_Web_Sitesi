import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="relative">
                {/* Outer glowing ring */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />

                {/* Core spinner */}
                <div className="relative flex flex-col items-center gap-4">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-indigo-500" />

                    {/* Text with animated gradient */}
                    <div className="animate-gradient bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-sm font-medium text-transparent">
                        Yükleniyor...
                    </div>
                </div>
            </div>
        </div>
    );
}
