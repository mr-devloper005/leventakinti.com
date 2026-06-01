import Link from 'next/link'
import { Clock3, Filter, Search } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singles].slice(0, 4)
}

const imageOf = (post: SitePost) => getImages(post)[0] || '/placeholder.svg?height=650&width=900'
const summaryOf = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || ''
const fieldOf = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task

  return (
    <EditableSiteShell>
      <main className="bg-[#f2f5f9] text-[#252a31]">
        <section className="bg-[#82cae5]">
          <div className="mx-auto max-w-[1100px] px-4 py-16 text-center text-white sm:px-6">
            <h1 className="text-4xl font-extrabold"><span className="text-[#e7ff85]">Browse</span> {label}</h1>
            <p className="mx-auto mt-3 max-w-3xl">Search local offers, services, jobs, property, and useful listings in one simple place.</p>
            <form action="/search" className="mx-auto mt-6 grid max-w-[900px] overflow-hidden rounded bg-white text-black md:grid-cols-[1fr_180px_150px]">
              <input name="q" placeholder="What are you looking for?" className="h-[58px] min-w-0 border-b border-[#edf0f3] px-5 outline-none md:border-b-0" />
              <select name="category" defaultValue={category} className="h-[58px] border-b border-[#edf0f3] px-4 text-sm outline-none md:border-b-0">
                <option value="all">Category</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="inline-flex h-[58px] items-center justify-center gap-2 text-sm font-bold"><Search className="h-4 w-4" /> Search</button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-extrabold">{category === 'all' ? 'Latest' : category}</h2>
            <form action={basePath} className="flex items-center gap-2 rounded border border-[#dfe4ea] bg-white px-3 py-2">
              <Filter className="h-4 w-4 text-[#69717d]" />
              <select name="category" defaultValue={category} className="bg-white text-sm outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="rounded bg-[#2f73f6] px-3 py-1.5 text-xs font-bold text-white">Apply</button>
            </form>
          </div>

          {posts.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded border border-dashed border-[#cfd5dc] bg-white p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[#69717d]" />
              <h2 className="mt-4 text-2xl font-extrabold">No posts found</h2>
              <p className="mt-2 text-sm text-[#69717d]">Try another category or check again after new listings are published.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded border border-[#cfd5dc] bg-white px-5 py-3 text-sm font-bold">Previous</Link> : null}
            <span className="rounded border border-[#cfd5dc] bg-white px-5 py-3 text-sm font-bold">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded border border-[#cfd5dc] bg-white px-5 py-3 text-sm font-bold">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug)
  const image = imageOf(post)
  const location = fieldOf(post, ['location', 'country', 'regions', 'city', 'address']) || '-'
  const price = fieldOf(post, ['price', 'amount', 'budget'])

  if (index % 5 === 1) {
    return (
      <Link href={href} className="group grid overflow-hidden rounded border border-[#dfe4ea] bg-white transition hover:-translate-y-0.5 hover:shadow-sm md:col-span-2 md:grid-cols-[260px_1fr]">
        <div className="flex h-[230px] items-center justify-center border-b border-[#e7ebef] bg-white p-4 md:border-b-0 md:border-r">
          <img src={image} alt={post.title} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="p-5">
          <p className="text-xs font-bold text-[#1262ff]">Featured classified</p>
          <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-[#333]">{post.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#4d5560]">{summaryOf(post)}</p>
          <p className="mt-4 text-sm text-[#333]">{price || location}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group overflow-hidden rounded border border-[#dfe4ea] bg-white transition hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex h-[200px] items-center justify-center border-b border-[#e7ebef] bg-white p-4">
        <img src={image} alt={post.title} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-[#3b3f45]">{post.title}</h3>
        <p className="mt-3 flex items-center gap-1 text-xs text-[#3b3f45]"><Clock3 className="h-3.5 w-3.5 fill-[#252a31]" /> {index + 1} minutes ago</p>
      </div>
      <div className="border-t border-[#e7ebef] px-4 py-3 text-sm text-[#333]">{location}</div>
    </Link>
  )
}
