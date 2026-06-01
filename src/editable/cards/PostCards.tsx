import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

const fallbackImage = '/placeholder.svg?height=650&width=900'

function contentOf(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function getEditablePostImage(post?: SitePost | null) {
  const content = contentOf(post)
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  return mediaUrl || contentImage || text(content.image) || text(content.featuredImage) || text(content.thumbnail) || text(content.logo) || fallbackImage
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = contentOf(post)
  const raw = text(content.description) || text(content.summary) || text(content.excerpt) || post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = contentOf(post)
  return text(content.category) || post?.tags?.[0] || 'Classified'
}

function getLocation(post?: SitePost | null) {
  const content = contentOf(post)
  return text(content.location) || text(content.city) || text(content.address) || '-'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Premium' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded border border-[#dfe4ea] bg-white transition hover:-translate-y-0.5 hover:shadow-sm">
      <div className="relative flex h-[200px] items-center justify-center border-b border-[#e7ebef] bg-white">
        <span className="absolute left-2 top-2 rounded bg-[#ef4c37] px-2 py-1 text-xs font-bold text-white">{label}</span>
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full max-h-[200px] w-auto max-w-full object-contain transition duration-300 group-hover:scale-[1.02]" />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-[#333]">{post.title}</h3>
      </div>
      <div className="border-t border-[#e7ebef] px-3 py-3 text-sm text-[#333]">{getLocation(post)}</div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block w-[160px] shrink-0 rounded border border-[#dfe4ea] bg-white p-2 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#e2e7ed] bg-white">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-12 w-12 object-cover" />
      </div>
      <h3 className="mt-3 line-clamp-2 text-xs font-bold leading-5 text-black">{getEditableCategory(post) || `Category ${index + 1}`}</h3>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded border border-[#cfd5dc] bg-white px-3 py-3 transition hover:border-black">
      <img src={getEditablePostImage(post)} alt="" className="h-7 w-7 rounded object-cover" />
      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold text-black">{post.title || `Listing ${index + 1}`}</h3>
        <p className="mt-1 truncate text-xs text-[#4d5560]">{getEditableCategory(post)}</p>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded border border-[#dfe4ea] bg-white transition hover:-translate-y-0.5 hover:shadow-sm sm:grid-cols-[220px_1fr]">
      <div className="flex h-44 items-center justify-center border-b border-[#e7ebef] bg-white sm:border-b-0 sm:border-r">
        <img src={getEditablePostImage(post)} alt={post.title} className="max-h-40 max-w-full object-contain" />
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-[#1262ff]">Latest {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 line-clamp-2 text-base font-semibold text-[#333]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#4d5560]">{getEditableExcerpt(post, 140)}</p>
        <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-black"><MapPin className="h-3.5 w-3.5" /> {getLocation(post)} <ArrowRight className="h-3.5 w-3.5" /></p>
      </div>
    </Link>
  )
}
