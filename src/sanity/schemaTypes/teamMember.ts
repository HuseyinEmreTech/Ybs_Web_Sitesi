import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Ekip Üyesi',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Ad Soyad',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Görev',
      type: 'string',
      options: {
        list: [
          { title: 'Başkan', value: 'baskan' },
          { title: 'Başkan Yardımcısı', value: 'baskan-yardimcisi' },
          { title: 'Genel Sekreter', value: 'genel-sekreter' },
          { title: 'Sosyal Medya Sorumlusu', value: 'sosyal-medya' },
          { title: 'Etkinlik Koordinatörü', value: 'etkinlik' },
          { title: 'Teknik Koordinatör', value: 'teknik' },
          { title: 'İletişim Sorumlusu', value: 'iletisim' },
          { title: 'Üye', value: 'uye' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Fotoğraf',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Kısa Biyografi',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'department',
      title: 'Bölüm',
      type: 'string',
      initialValue: 'Yönetim Bilişim Sistemleri',
    }),
    defineField({
      name: 'year',
      title: 'Sınıf',
      type: 'string',
      options: {
        list: [
          { title: '1. Sınıf', value: '1' },
          { title: '2. Sınıf', value: '2' },
          { title: '3. Sınıf', value: '3' },
          { title: '4. Sınıf', value: '4' },
          { title: 'Mezun', value: 'mezun' },
        ],
      },
    }),
    defineField({
      name: 'email',
      title: 'E-posta',
      type: 'string',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
    }),
    defineField({
      name: 'github',
      title: 'GitHub',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      description: 'Düşük sayı önce görünür (Başkan: 1, Yardımcı: 2, vs.)',
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'Sıralamaya Göre',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})



