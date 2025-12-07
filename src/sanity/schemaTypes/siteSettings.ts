import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  fields: [
    defineField({
      name: 'clubName',
      title: 'Kulüp Adı',
      type: 'string',
      initialValue: 'YBS Kulübü',
    }),
    defineField({
      name: 'tagline',
      title: 'Slogan',
      type: 'string',
      description: 'Ana sayfada görünecek kısa slogan',
    }),
    defineField({
      name: 'description',
      title: 'Site Açıklaması',
      type: 'text',
      rows: 3,
      description: 'SEO için kullanılır',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'heroImage',
      title: 'Ana Sayfa Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutText',
      title: 'Hakkımızda Metni',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'mission',
      title: 'Misyon',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'vision',
      title: 'Vizyon',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'email',
      title: 'E-posta',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter/X',
      type: 'url',
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
  ],
  preview: {
    prepare() {
      return { title: 'Site Ayarları' }
    },
  },
})

