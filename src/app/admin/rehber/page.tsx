'use client'

import { useState } from 'react'

interface GuideSection {
    id: string
    title: string
    icon: string
    description: string
    steps: string[]
    tips?: string[]
}

const guideSections: GuideSection[] = [
    {
        id: 'giris',
        title: 'Giriş ve Genel Bakış',
        icon: '🎯',
        description: 'Admin paneli, YBS Kulübü web sitesinin içeriklerini yönetmenizi sağlayan güçlü bir araçtır. Bu rehber, tüm özellikleri detaylı şekilde açıklamaktadır.',
        steps: [
            'Admin paneline erişmek için /admin adresine gidin',
            'E-posta ve şifrenizle giriş yapın',
            'Sol menüden istediğiniz bölüme tıklayarak erişebilirsiniz',
            'Sağ üst köşedeki kullanıcı bilgilerinizi görebilirsiniz',
        ],
        tips: [
            'Güvenlik için güçlü bir şifre kullanın',
            'Çıkış yapmayı unutmayın',
        ]
    },
    {
        id: 'dashboard',
        title: 'Dashboard (Kontrol Paneli)',
        icon: '📊',
        description: 'Dashboard, sitenizin genel durumunu görüntülemenizi sağlar. Toplam blog yazısı, etkinlik, ekip üyesi ve mesaj sayılarını buradan takip edebilirsiniz.',
        steps: [
            'Sol menüden "Dashboard" seçeneğine tıklayın',
            'İstatistik kartlarından genel durumu görüntüleyin',
            'Her karta tıklayarak ilgili bölüme hızlıca gidin',
        ],
        tips: [
            'Dashboard, giriş yaptığınızda otomatik olarak açılır',
            'İstatistikler anlık olarak güncellenir',
        ]
    },
    {
        id: 'blog',
        title: 'Blog Yazıları Yönetimi',
        icon: '📝',
        description: 'Blog bölümü, kulüp haberlerini ve duyurularını yayınlamanızı sağlar. Yazıları oluşturabilir, düzenleyebilir ve silebilirsiniz.',
        steps: [
            '"Blog Yazıları" menüsüne tıklayın',
            'Yeni yazı eklemek için "Yeni Yazı Ekle" butonuna basın',
            'Başlık, içerik, özet ve kapak görseli URL\'sini girin',
            'Kategori ve etiketleri belirleyin',
            '"Yayınlandı" kutusunu işaretleyerek yazıyı yayına alın',
            'Düzenlemek için yazı satırındaki kalem ikonuna tıklayın',
            'Silmek için çöp kutusu ikonuna tıklayın',
        ],
        tips: [
            'Kapak görseli için harici bir URL kullanabilirsiniz (örn: Unsplash)',
            'Slug otomatik oluşturulur, ancak manuel düzenleyebilirsiniz',
            'Taslak olarak kaydetmek için "Yayınlandı" kutusunu işaretlemeyin',
        ]
    },
    {
        id: 'etkinlikler',
        title: 'Etkinlik Yönetimi',
        icon: '🎉',
        description: 'Kulüp etkinliklerini, seminerleri ve toplantıları bu bölümden yönetebilirsiniz. Tarih, konum ve detayları buradan girebilirsiniz.',
        steps: [
            '"Etkinlikler" menüsüne tıklayın',
            '"Yeni Etkinlik Ekle" butonuna basın',
            'Etkinlik adı, açıklaması ve detaylı içeriği girin',
            'Tarih ve saat bilgilerini seçin',
            'Konum veya online bağlantı bilgilerini ekleyin',
            'Kapak görseli URL\'sini ekleyin',
            'Kaydet butonuna basarak etkinliği oluşturun',
        ],
        tips: [
            'Geçmiş etkinlikler otomatik olarak arşivlenir',
            'Online etkinlikler için Zoom/Meet linkini konum alanına yazabilirsiniz',
            'Etkinlik detaylarını güncellemek için düzenle ikonuna tıklayın',
        ]
    },
    {
        id: 'ekip',
        title: 'Ekip Üyeleri Yönetimi',
        icon: '👥',
        description: 'Kulüp yönetim kurulu ve aktif üyeleri bu bölümden yönetebilirsiniz. Fotoğraf, unvan ve sosyal medya bağlantıları ekleyebilirsiniz.',
        steps: [
            '"Ekip" menüsüne tıklayın',
            'Mevcut üyeleri listeden görüntüleyin',
            '"Yeni Üye Ekle" butonuna basın',
            'İsim, unvan ve biyografi bilgilerini girin',
            'Profil fotoğrafı URL\'sini ekleyin (opsiyonel)',
            'Sosyal medya bağlantılarını ekleyin (LinkedIn, Twitter, vb.)',
            'Sıra numarası ile görünüm sırasını ayarlayın',
        ],
        tips: [
            'Profil fotoğrafları için kare format önerilir',
            'Sıra numarası küçük olan üyeler önce gösterilir',
            'Aktif olmayan üyeler için "Aktif" kutusunu kaldırın',
        ]
    },
    {
        id: 'yapilandirma',
        title: 'Organizasyon Yapılandırması',
        icon: '🏗️',
        description: 'Kulübün organizasyon yapısını ve hiyerarşisini bu bölümden düzenleyebilirsiniz. Bölümler, alt gruplar ve roller buradan yönetilir.',
        steps: [
            '"Yapılandırma" menüsüne tıklayın',
            'Mevcut organizasyon yapısını görüntüleyin',
            'Yeni bölüm veya alt grup ekleyin',
            'Üyeleri ilgili bölümlere atayın',
            'Rolleri ve unvanları güncelleyin',
        ],
        tips: [
            'Değişiklikler yönetim kurulu sayfasına yansır',
            'Hiyerarşi yapısını dikkatli planlayın',
        ]
    },
    {
        id: 'hakkimizda',
        title: 'Hakkımızda Sayfası',
        icon: '🏢',
        description: 'Kulüp tanıtım metnini, misyon ve vizyonu bu bölümden güncelleyebilirsiniz.',
        steps: [
            '"Hakkımızda" menüsüne tıklayın',
            'Kulüp açıklamasını düzenleyin',
            'Misyon ve vizyon metinlerini güncelleyin',
            'Değerleri ve hedefleri ekleyin',
            'Kaydet butonuna basın',
        ],
        tips: [
            'Metinler otomatik olarak ana sayfaya yansır',
            'Kısa ve öz açıklamalar kullanın',
        ]
    },
    {
        id: 'mesajlar',
        title: 'Gelen Kutusu (Mesajlar)',
        icon: '✉️',
        description: 'İletişim formundan gelen mesajları buradan görüntüleyebilirsiniz. Ziyaretçilerden gelen sorular ve geri bildirimler bu bölümde listelenir.',
        steps: [
            '"Gelen Kutusu" menüsüne tıklayın',
            'Gelen mesajları listeden görüntüleyin',
            'Mesaja tıklayarak detayları okuyun',
            'Okundu/okunmadı durumunu güncelleyin',
            'Yanıtlamak için gönderenin e-postasını kopyalayın',
            'Gereksiz mesajları silin',
        ],
        tips: [
            'Yeni mesajlar üst sırada görünür',
            'Mesaj sayısı dashboard\'da görüntülenir',
            'Önemli mesajları not alın',
        ]
    },
    {
        id: 'ayarlar',
        title: 'Site Ayarları',
        icon: '⚙️',
        description: 'Genel site ayarlarını bu bölümden yapılandırabilirsiniz. Sosyal medya bağlantıları, iletişim bilgileri ve diğer ayarlar burada.',
        steps: [
            '"Site Ayarları" menüsüne tıklayın',
            'Site başlığı ve açıklamasını düzenleyin',
            'Sosyal medya bağlantılarını güncelleyin',
            'İletişim bilgilerini (e-posta, telefon, adres) girin',
            'Kaydet butonuna basın',
        ],
        tips: [
            'Değişiklikler anında siteye yansır',
            'SEO için açıklama alanını doldurun',
        ]
    },
    {
        id: 'kullanicilar',
        title: 'Kullanıcı Yönetimi',
        icon: '🔐',
        description: 'Admin paneline erişimi olan kullanıcıları bu bölümden yönetebilirsiniz. Yeni yöneticiler ekleyebilir, şifreleri sıfırlayabilirsiniz.',
        steps: [
            '"Kullanıcılar" menüsüne tıklayın',
            'Mevcut kullanıcıları listeden görüntüleyin',
            '"Yeni Kullanıcı Ekle" butonuna basın',
            'E-posta, isim ve şifre belirleyin',
            'Kullanıcı rolünü seçin (Admin/Editor)',
            'Profil fotoğrafı URL\'sini ekleyin (opsiyonel)',
            'Mevcut kullanıcıyı düzenlemek veya silmek için ilgili butonları kullanın',
        ],
        tips: [
            'Güçlü şifreler kullanılmasını sağlayın',
            'Admin rolü tüm yetkilere sahiptir',
            'Kendi hesabınızı silemezsiniz',
        ]
    },
    {
        id: 'projeler',
        title: 'Proje Yönetimi',
        icon: '🚀',
        description: 'Kulüp projelerini ve çalışmalarını bu bölümden sergileyebilirsiniz. Tamamlanan veya devam eden projeleri ekleyin.',
        steps: [
            '"Projeler" menüsüne tıklayın',
            '"Yeni Proje Ekle" butonuna basın',
            'Proje adı ve açıklamasını girin',
            'Detaylı içerik ekleyin',
            'Kapak görseli URL\'sini belirleyin',
            'Proje durumunu seçin (Devam Ediyor/Tamamlandı)',
            'Kullanılan teknolojileri etiket olarak ekleyin',
            'Proje linkini (varsa) girin',
        ],
        tips: [
            'Projeler ana sayfada öne çıkan bölümde gösterilebilir',
            'Kaliteli görseller kullanın',
            'Teknoloji etiketleri arama için faydalıdır',
        ]
    },
    {
        id: 'sorun-giderme',
        title: 'Sorun Giderme (Troubleshooting)',
        icon: '🔧',
        description: 'Karşılaşabileceğiniz olası sorunlar ve çözüm önerileri.',
        steps: [
            'Eğer siteye erişemiyorsanız, internet bağlantınızı kontrol edin.',
            'Sayfa bembeyaz açılıyorsa veya "Bir Şeyler Ters Gitti" hatası görüyorsanız sayfayı yenileyin.',
            'Görseller görünmüyorsa, eklediğiniz URL\'in herkese açık olduğundan emin olun.',
            'Değişiklikleriniz görünmüyorsa sayfayı yenileyin (F5 veya Ctrl+R).',
        ],
        tips: [
            'Hata almaya devam ederseniz yönetici ile iletişime geçin.',
            'Yeni eklenen özellikler için sayfayı yenilemeniz gerekebilir.',
        ]
    },
    {
        id: 'gorsel-url',
        title: "Görsel URL'si Nasıl Alınır?",
        icon: '🖼️',
        description: 'Sitemize resim eklemek için görselin internet üzerindeki adresine (URL) ihtiyacınız vardır. Bu rehberde görsel adresini nasıl alacağınızı öğrenebilirsiniz.',
        steps: [
            'Google Görseller veya herhangi bir web sitesinde beğendiğiniz resmin üzerine SAĞ TIKLAYIN.',
            'Açılan menüden "Bütününü yeni sekmede aç" veya "Resim adresini kopyala" seçeneğine tıklayın. (Tarayıcıya göre değişebilir: "Copy Image Address", "Kopyala: Resim Adresi")',
            'Eğer kendi bilgisayarınızdaki bir resmi kullanmak istiyorsanız, önce "hizliresim.com", "imgbb.com" gibi bir siteye yükleyin.',
            'Yükleme tamamlandıktan sonra verilen "Doğrudan Bağlantı" (Direct Link) veya görselin kendisine sağ tıklayıp aldığınız adresi kullanın.',
            'Kopyaladığınız adresi Admin panelindeki ilgili "Görsel URL" kutucuğuna yapıştırın.',
        ],
        tips: [
            'Doğru bir görsel linki genellikle ".jpg", ".png", ".jpeg", ".webp" ile biter.',
            'Linki tarayıcı adres çubuğuna yapıştırdığınızda sadece resim görünmelidir.',
            'Google Drive veya Dropbox linkleri genellikle doğrudan çalışmaz.',
        ]
    },
]

export default function RehberPage() {
    const [activeSection, setActiveSection] = useState<string>('giris')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredSections = guideSections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.steps.some(step => step.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const currentSection = guideSections.find(s => s.id === activeSection)

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">📚</span>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        Admin Panel Rehberi
                    </h1>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                    YBS Kulübü yönetim panelinin detaylı kullanım kılavuzu
                </p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Rehberde ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white placeholder-slate-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Section Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sticky top-6">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
                            İçindekiler
                        </h3>
                        <nav className="space-y-1">
                            {filteredSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === section.id
                                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <span className="text-lg">{section.icon}</span>
                                    <span className="text-sm">{section.title}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {currentSection && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 lg:p-8">
                            {/* Section Header */}
                            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-3xl">
                                    {currentSection.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                                        {currentSection.title}
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {currentSection.description}
                                    </p>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="text-indigo-500">📋</span>
                                    Adım Adım Kullanım
                                </h3>
                                <div className="space-y-3">
                                    {currentSection.steps.map((step, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 pt-1">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            {currentSection.tips && currentSection.tips.length > 0 && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                                    <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                                        <span>💡</span>
                                        İpuçları
                                    </h3>
                                    <ul className="space-y-2">
                                        {currentSection.tips.map((tip, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2 text-amber-700 dark:text-amber-300"
                                            >
                                                <span className="text-amber-500 mt-0.5">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">🆘 Yardıma mı ihtiyacın var?</h3>
                            <p className="text-indigo-100 text-sm mb-4">
                                Herhangi bir sorunla karşılaşırsan sistem yöneticisiyle iletişime geç.
                            </p>
                            <a
                                href="mailto:admin@ybskulubu.com"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                            >
                                ✉️ E-posta Gönder
                            </a>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">🔄 Güncellemeler</h3>
                            <p className="text-emerald-100 text-sm mb-4">
                                Admin paneli sürekli geliştirilmektedir. Yeni özellikler eklendikçe rehber güncellenecektir.
                            </p>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium">
                                📅 Son güncelleme: Aralık 2024
                            </span>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span>⌨️</span>
                            Faydalı Bilgiler
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <span className="text-2xl">🖼️</span>
                                <div>
                                    <p className="font-medium text-slate-700 dark:text-slate-300">Görseller</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Harici URL kullanın (Unsplash, ImgBB vb.)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <span className="text-2xl">🔒</span>
                                <div>
                                    <p className="font-medium text-slate-700 dark:text-slate-300">Güvenlik</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Oturumunuz güvenli şekilde korunur</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <span className="text-2xl">📱</span>
                                <div>
                                    <p className="font-medium text-slate-700 dark:text-slate-300">Mobil Uyumluluk</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Panel tüm cihazlarda çalışır</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <span className="text-2xl">🌙</span>
                                <div>
                                    <p className="font-medium text-slate-700 dark:text-slate-300">Karanlık Mod</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Sistem ayarına göre otomatik değişir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
