import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Post, Event } from '@/sanity/lib/queries'
import Card from '@/components/Card'
import Button from '@/components/Button'
import CountUp from '@/components/CountUp'
import { clsx } from 'clsx'

interface HomePageContentProps {
    posts: Post[]
    events: Event[]
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function HomePageContent({ posts, events }: HomePageContentProps) {
    return (
        <div className="overflow-hidden min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

            {/* Background Aurora Effect */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 animate-aurora blur-3xl opacity-50" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-8 z-10">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mx-auto max-w-4xl text-center"
                >
                    <motion.div variants={item} className="mb-8 flex justify-center">
                        <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-sm leading-6 text-indigo-600 dark:text-indigo-300 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700/50 glass dark:glass-dark">
                            🚀 Geleceğin Liderleri Buradan Çıkar
                        </span>
                    </motion.div>

                    <motion.h1 variants={item} className="text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-7xl mb-8 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-white bg-clip-text text-transparent">
                        Yönetim Bilişim Sistemleri <br className="hidden sm:block" />
                        <span className="text-indigo-600 dark:text-indigo-400">Öğrenci Kulübü</span>
                    </motion.h1>

                    <motion.p variants={item} className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto glass dark:glass-dark rounded-2xl p-6 border-white/50 dark:border-white/10">
                        Teknoloji ve iş dünyasını bir araya getiriyoruz.
                        Geleceğinize yön vermek, ağınızı genişletmek ve kendinizi geliştirmek için doğru yerdesiniz.
                    </motion.p>

                    <motion.div variants={item} className="mt-10 flex items-center justify-center gap-x-6">
                        <Button href="/uye-ol" size="lg" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow">
                            Aramıza Katıl
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={item} className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 glass dark:glass-dark p-8 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm mx-auto max-w-4xl">
                        {[
                            { label: 'Aktif Üye', value: 500, suffix: '+' },
                            { label: 'Etkinlik', value: 40, suffix: '+' },
                            { label: 'Proje', value: 15, suffix: '+' },
                            { label: 'Yıllık Deneyim', value: 5, suffix: '' },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <dd className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                    <CountUp value={stat.value} suffix={stat.suffix} />
                                </dd>
                                <dt className="text-sm font-semibold leading-6 text-neutral-500 dark:text-neutral-400">{stat.label}</dt>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Shapes */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200 to-indigo-200 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full blur-[100px] opacity-30 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-24 w-[500px] h-[500px] bg-gradient-to-tr from-pink-200 to-rose-200 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full blur-[100px] opacity-30 pointer-events-none z-0" />

            {/* Events Section */}
            <section className="relative py-24 sm:py-32 z-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mx-auto max-w-2xl text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">Yaklaşan Etkinlikler</h2>
                        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                            Kariyerinize değer katacak workshoplar, seminerler ve buluşmalar.
                        </p>
                    </motion.div>

                    {events.length > 0 ? (
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {events.map((event, index) => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <Card
                                        title={event.title}
                                        description={event.description}
                                        image={event.image}
                                        href={`/etkinlikler/${event.slug.current}`}
                                        date={event.date}
                                        category={event.eventType}
                                        className="glass-card dark:glass-card h-full"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass dark:glass-dark rounded-2xl border border-white/50 dark:border-white/10">
                            <p className="text-neutral-500 dark:text-neutral-400">Şu an planlanmış etkinlik bulunmuyor.</p>
                            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-2">Yeni etkinlikler için bizi takip edin!</p>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Button href="/etkinlikler" variant="secondary" className="glass dark:glass-dark hover:bg-white/80 dark:hover:bg-white/10 text-neutral-900 dark:text-neutral-200">
                            Tüm Etkinlikleri Gör →
                        </Button>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="relative py-24 sm:py-32 bg-white/30 dark:bg-black/30 backdrop-blur-sm z-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mx-auto max-w-2xl text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">Son Yazılar</h2>
                        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                            Teknoloji dünyasından haberler, öğrenci deneyimleri ve rehber içerikler.
                        </p>
                    </motion.div>

                    {posts.length > 0 ? (
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <Card
                                        title={post.title}
                                        description={post.excerpt}
                                        image={post.mainImage}
                                        href={`/blog/${post.slug.current}`}
                                        date={post.publishedAt}
                                        category={post.category}
                                        className="glass-card dark:glass-card h-full"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass dark:glass-dark rounded-2xl border border-white/50 dark:border-white/10">
                            <p className="text-neutral-500 dark:text-neutral-400">Henüz yazı yayınlanmadı.</p>
                        </div>
                    )}
                    <div className="mt-12 text-center">
                        <Button href="/blog" variant="secondary" className="glass dark:glass-dark hover:bg-white/80 dark:hover:bg-white/10 text-neutral-900 dark:text-neutral-200">
                            Blogu Oku →
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 overflow-hidden z-10">
                <div className="absolute inset-0 bg-neutral-900 dark:bg-black">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center sm:py-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        YBS Ailesine Katılmaya Hazır mısın?
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                        Etkinliklerimizden haberdar olmak, projelerde yer almak ve kariyerine yön vermek için hemen bize ulaş.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button href="/iletisim" variant="primary" size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 border-none transition-transform hover:scale-105">
                            İletişime Geç
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
