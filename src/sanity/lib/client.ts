import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Next.js cache-enabled fetch function
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number | false
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === 'development' ? 30 : revalidate,
      tags,
    },
  })
}
