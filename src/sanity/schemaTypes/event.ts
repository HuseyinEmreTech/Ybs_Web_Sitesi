import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Etkinlik',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Etkinlik Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Tarih',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Bitiş Tarihi',
      type: 'datetime',
      description: 'Opsiyonel - çok günlük etkinlikler için',
    }),
    defineField({
      name: 'location',
      title: 'Konum',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Kısa Açıklama',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Detaylı İçerik',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({
      name: 'image',
      title: 'Kapak Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'eventType',
      title: 'Etkinlik Türü',
      type: 'string',
      options: {
        list: [
          { title: 'Seminer', value: 'seminer' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Sosyal Etkinlik', value: 'sosyal' },
          { title: 'Yarışma', value: 'yarisma' },
          { title: 'Konferans', value: 'konferans' },
        ],
      },
    }),
    defineField({
      name: 'registrationLink',
      title: 'Kayıt Linki',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
    },
    prepare(selection) {
      const { title, date } = selection
      const dateStr = date ? new Date(date).toLocaleDateString('tr-TR') : ''
      return { ...selection, title, subtitle: dateStr }
    },
  },
  orderings: [
    {
      title: 'Tarihe Göre (Yeni)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})



