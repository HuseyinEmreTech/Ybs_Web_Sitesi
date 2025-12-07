import { groq } from 'next-sanity'

// ============ POSTS ============
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    mainImage,
    category
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    mainImage,
    body,
    category
  }
`

export const latestPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    mainImage,
    category
  }
`

// ============ EVENTS ============
export const eventsQuery = groq`
  *[_type == "event"] | order(date desc) {
    _id,
    title,
    slug,
    date,
    endDate,
    location,
    description,
    image,
    eventType,
    registrationLink
  }
`

export const upcomingEventsQuery = groq`
  *[_type == "event" && date >= now()] | order(date asc)[0...3] {
    _id,
    title,
    slug,
    date,
    location,
    description,
    image,
    eventType,
    registrationLink
  }
`

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    endDate,
    location,
    description,
    content,
    image,
    eventType,
    registrationLink
  }
`

// ============ TEAM MEMBERS ============
export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    image,
    bio,
    department,
    year,
    email,
    linkedin,
    github
  }
`

// ============ PROJECTS ============
export const projectsQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    image,
    technologies,
    status,
    year,
    githubUrl,
    liveUrl,
    "teamMembers": teamMembers[]->{ name, image }
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content,
    image,
    technologies,
    status,
    year,
    githubUrl,
    liveUrl,
    "teamMembers": teamMembers[]->{ name, image, role }
  }
`

// ============ SITE SETTINGS ============
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    clubName,
    tagline,
    description,
    logo,
    heroImage,
    aboutText,
    mission,
    vision,
    email,
    phone,
    address,
    instagram,
    twitter,
    linkedin,
    github
  }
`

// ============ TYPES ============
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  author?: string
  publishedAt?: string
  excerpt?: string
  mainImage?: SanityImage
  body?: any[]
  category?: string
}

export interface Event {
  _id: string
  title: string
  slug: { current: string }
  date: string
  endDate?: string
  location?: string
  description?: string
  content?: any[]
  image?: SanityImage
  eventType?: string
  registrationLink?: string
}

export interface TeamMember {
  _id: string
  name: string
  role?: string
  image?: SanityImage
  bio?: string
  department?: string
  year?: string
  email?: string
  linkedin?: string
  github?: string
}

export interface Project {
  _id: string
  title: string
  slug?: { current: string }
  description?: string
  content?: any[]
  image?: SanityImage
  technologies?: string[]
  status?: string
  year?: string
  githubUrl?: string
  liveUrl?: string
  teamMembers?: { name: string; image?: SanityImage; role?: string }[]
}

export interface SiteSettings {
  clubName?: string
  tagline?: string
  description?: string
  logo?: SanityImage
  heroImage?: SanityImage
  aboutText?: any[]
  mission?: string
  vision?: string
  email?: string
  phone?: string
  address?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  github?: string
}

export interface SanityImage {
  asset: {
    _ref: string
    _type: string
  }
  hotspot?: {
    x: number
    y: number
  }
}



