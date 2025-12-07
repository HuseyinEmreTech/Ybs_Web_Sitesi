import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Proje',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Proje Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'description',
      title: 'Kısa Açıklama',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Detaylı Açıklama',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({
      name: 'image',
      title: 'Proje Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'technologies',
      title: 'Kullanılan Teknolojiler',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'status',
      title: 'Proje Durumu',
      type: 'string',
      options: {
        list: [
          { title: 'Devam Ediyor', value: 'devam' },
          { title: 'Tamamlandı', value: 'tamamlandi' },
          { title: 'Planlanıyor', value: 'planlaniyor' },
        ],
      },
      initialValue: 'devam',
    }),
    defineField({
      name: 'year',
      title: 'Yıl',
      type: 'string',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub Linki',
      type: 'url',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Canlı Demo Linki',
      type: 'url',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Proje Ekibi',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      media: 'image',
    },
    prepare(selection) {
      const { status } = selection
      const statusMap: Record<string, string> = {
        devam: '🔄 Devam Ediyor',
        tamamlandi: '✅ Tamamlandı',
        planlaniyor: '📋 Planlanıyor',
      }
      return { ...selection, subtitle: statusMap[status] || '' }
    },
  },
})


