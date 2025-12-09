# YBS Kulübü Web Sitesi

Yönetim Bilişim Sistemleri (YBS) Öğrenci Kulübü için geliştirilmiş, modern ve dinamik bir web platformu.

## 🚀 Proje Hakkında

Bu proje, kulüp etkinliklerinin duyurulması, blog yazılarının paylaşılması ve ekip üyelerinin tanıtılması amacıyla geliştirilmiştir. Kullanıcı dostu arayüzü ve güçlü yönetim paneli ile kulüp faaliyetlerinin dijital dünyadaki yüzüdür.

### Özellikler

- **Modern Tasarım**: Next.js ve Tailwind CSS ile hazırlanmış, "Liquid Glass" estetiğine sahip responsive arayüz.
- **Karanlık Mod**: Otomatik sistem tercihi algılama ve manuel geçiş imkanı.
- **Yönetim Paneli**: Etkinlik, blog, ekip ve site ayarlarını yönetmek için güvenli admin paneli.
- **Veritabanı**: Vercel Postgres ve Prisma ORM ile güçlü veri yönetimi.
- **Dinamik İçerik**: Anlık güncellenebilen etkinlik ve blog sayfaları.

## 🛠️ Teknolojiler

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **Veritabanı**: Vercel Postgres (Neon)
- **ORM**: Prisma
- **Deployment**: Vercel

## ⚙️ Kurulum (Local Development)

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/KULLANICI_ADI/Ybs_Web_Sitesi-1.git
    cd Ybs_Web_Sitesi-1
    ```

2.  **Paketleri Yükleyin:**
    ```bash
    npm install
    ```

3.  **Çevre Değişkenlerini Ayarlayın:**
    `.env` dosyasını oluşturun ve gerekli veritabanı bağlantı bilgilerini ekleyin. (Vercel projenizden `POSTGRES_PRISMA_URL` vb. bilgileri almanız gerekmektedir.)
    ```env
    POSTGRES_PRISMA_URL="..."
    POSTGRES_URL_NON_POOLING="..."
    ADMIN_EMAIL="admin@ybskulubu.com"
    ADMIN_PASSWORD="guclu-bir-sifre"
    ```

4.  **Veritabanını Hazırlayın:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Sunucuyu Başlatın:**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:3000` adresine gidin.

## 📝 Yönetim Paneli Kullanımı

- `/admin` adresine giderek giriş yapabilirsiniz.
- İlk kurulumda `.env` dosyasında belirlediğiniz `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ile giriş yaptığınızda, admin kullanıcısı veritabanına otomatik olarak oluşturulur.

## ☁️ Yayına Alma (Deployment)

Bu proje [Vercel](https://vercel.com) üzerinde çalışmak üzere optimize edilmiştir.

1.  Projeyi GitHub'a yükleyin.
2.  Vercel'de yeni proje oluşturun ve GitHub deponuzu seçin.
3.  Vercel Storage sekmesinden yeni bir **Postgres** veritabanı oluşturun ve projeye bağlayın.
4.  Environment Variables kısmına `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ekleyin.
5.  Deploy butonuna basın!

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.
