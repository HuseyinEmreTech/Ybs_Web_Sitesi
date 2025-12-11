'use client'

import { useState } from 'react'

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')
        setErrorMessage('')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', subject: '', message: '' })
            } else {
                setStatus('error')
                setErrorMessage(data.error || 'Bir hata oluştu.')
            }
        } catch {
            setStatus('error')
            setErrorMessage('Sunucuya erişilemedi.')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    if (status === 'success') {
        return (
            <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-xl border border-green-200 dark:border-green-900/30 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Mesajınız Gönderildi!</h3>
                <p className="text-green-700 dark:text-green-400 mb-6">En kısa sürede size geri dönüş yapacağız.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-sm font-medium text-green-700 dark:text-green-400 hover:underline"
                >
                    Yeni Mesaj Gönder
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-foreground mb-6">
                Mesaj Gönderin
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Ad Soyad
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-shadow bg-white dark:bg-slate-950 dark:text-white"
                            placeholder="Adınız Soyadınız"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            E-posta
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-shadow bg-white dark:bg-slate-950 dark:text-white"
                            placeholder="ornek@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Konu
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-shadow bg-white dark:bg-slate-950 dark:text-white"
                    >
                        <option value="" className="dark:bg-slate-950">Konu Seçin</option>
                        <option value="membership" className="dark:bg-slate-950">Üyelik Başvurusu</option>
                        <option value="event" className="dark:bg-slate-950">Etkinlik Hakkında</option>
                        <option value="collaboration" className="dark:bg-slate-950">İşbirliği Teklifi</option>
                        <option value="sponsorship" className="dark:bg-slate-950">Sponsorluk</option>
                        <option value="other" className="dark:bg-slate-950">Diğer</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Mesaj
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-shadow resize-none bg-white dark:bg-slate-950 dark:text-white"
                        placeholder="Mesajınızı buraya yazın..."
                    />
                </div>

                {status === 'error' && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.'}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {status === 'submitting' ? 'Gönderiliyor...' : 'Gönder'}
                </button>
            </form>
        </div>
    )
}
