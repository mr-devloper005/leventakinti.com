import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bookmark, Clock3, ExternalLink, Facebook, Mail, MessageCircle, Phone, PinIcon, Share2, ThumbsUp } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const formatPlainText = (raw: string) => {
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  return raw.split(/\n{2,}/).map((part) => `<p>${part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('')
}

const locationOf = (post: SitePost) => getField(post, ['location', 'country', 'regions', 'city', 'address']) || '-'

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const taskConfig = getTaskConfig(task)
  const images = getImages(post)
  const mainImage = images[0]
  const phone = getField(post, ['phone', 'telephone', 'mobile', 'whatsapp'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url', 'link'])
  const id = post.id || post.slug || 'listing'

  return (
    <EditableSiteShell>
      <main className="bg-[#f2f5f9] text-[#252a31]">
        <div className="mx-auto max-w-[1100px] px-4 py-7 sm:px-6">
          <div className="mb-5 rounded bg-[#e8f3d9] py-5 text-center text-sm text-[#252a31]">..</div>
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_337px]">
            <article className="min-w-0">
              <h1 className="text-xl font-extrabold text-[#20242a]">{post.title}</h1>
              <p className="mt-2 text-sm text-[#3e454f]">{locationOf(post)}</p>
              <div className="mt-5 rounded border border-[#dfe4ea] bg-white p-5">
                {mainImage ? (
                  <img src={mainImage} alt={post.title} className="mx-auto max-h-[680px] w-full object-contain" />
                ) : (
                  <div className="flex h-[420px] items-center justify-center bg-[#eef2f6] text-sm text-[#69717d]">No image available</div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
                
                <span className="rounded border border-[#d6dce3] bg-white px-3 py-2">1336 hits</span>
                <span className="rounded border border-[#d6dce3] bg-white px-3 py-2">ID #{id}</span>
              </div>

              <section className="mt-7">
                <h2 className="text-base font-extrabold">Description</h2>
                <div className="article-content mt-3 max-w-[700px] text-base leading-7 text-[#4b5159]" dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
              </section>

              <Attributes post={post} />
              <div className="mt-7 rounded bg-[#e8f3d9] py-5 text-center text-sm">..</div>
              {task === 'article' ? <EditableComments slug={post.slug} comments={comments} /> : null}
              <RelatedPanel task={task} related={related} />
            </article>

            <aside className="lg:sticky lg:top-20 lg:self-start">
              <div className="rounded border border-[#dfe4ea] bg-white">
                <div className="p-4">
                  <div className="flex gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-[#edf0f3] bg-white">
                      {mainImage ? <img src={mainImage} alt={post.title} className="h-full w-full object-cover" /> : <Bookmark className="h-6 w-6 text-[#69717d]" />}
                    </div>
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-lg font-extrabold">{post.title}</h2>
                      <p className="text-sm text-[#69717d]">Posting for 5+ Months</p>
                      <Link href={taskConfig?.route || '/'} className="text-sm text-[#1262ff]">view profile</Link>
                    </div>
                  </div>
                  {email ? <a href={`mailto:${email}`} className="mt-4 flex h-9 items-center justify-center rounded bg-[#2f73f6] text-sm text-white">Message seller</a> : <Link href="/contact" className="mt-4 flex h-9 items-center justify-center rounded bg-[#2f73f6] text-sm text-white">Message seller</Link>}
                </div>
                <div className="border-t border-[#e7ebef] p-5 text-center">
                  <Link href={taskConfig?.route || '/'} className="text-sm text-[#1262ff]">Browse all seller&apos;s ads</Link>
                </div>
                <div className="border-t border-[#e7ebef] p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button className="rounded border border-[#bfc6cf] py-2 text-sm">Save</button>
                    <button className="rounded border border-[#bfc6cf] py-2 text-sm">Recommend</button>
                  </div>
                </div>
               
                <ContactBox phone={phone} email={email} website={website} />
              </div>
              <div className="mt-5 rounded bg-[#e8f3d9] py-7 text-center text-sm">..</div>
              <div className="mt-5 rounded border border-[#dfe4ea] bg-white">
                <div className="flex items-center justify-between border-b border-[#e7ebef] p-4 font-extrabold">
                  <span>Comments</span>
                  <span className="inline-flex items-center gap-1 text-sm font-normal"><MessageCircle className="h-4 w-4 fill-[#252a31]" /> 0x</span>
                </div>
                <div className="p-4"><button className="h-9 w-full rounded bg-[#2f73f6] text-sm text-white">Add a new comment</button></div>
              </div>
              <div className="mt-5 rounded bg-[#e8f3d9] py-7 text-center text-sm">..</div>
            </aside>
          </div>
        </div>
      </main>
    </EditableSiteShell>
  )
}

function Attributes({ post }: { post: SitePost }) {
  const rows = [
    ['Country', getField(post, ['country'])],
    ['Regions', getField(post, ['regions', 'region', 'state'])],
    ['City', getField(post, ['city'])],
    ['Pin / Zip', getField(post, ['pin', 'zip', 'postcode', 'postalCode'])],
    ['Whatsapp No.', getField(post, ['whatsapp', 'mobile', 'phone'])],
    ['Website', getField(post, ['website', 'url'])],
    ['Latitude', getField(post, ['lat', 'latitude'])],
    ['Longitude', getField(post, ['lng', 'lon', 'longitude'])],
    ['Address', getField(post, ['address', 'location'])],
  ].filter(([, value]) => value)

  if (!rows.length) return null
  return (
    <section className="mt-8 max-w-[704px]">
      <h2 className="mb-3 text-base font-extrabold">Attributes</h2>
      <div className="overflow-hidden border-y border-[#dfe4ea]">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[0.65fr_1fr] border-b border-[#dfe4ea] bg-white last:border-b-0 even:bg-[#f6f8fb]">
            <div className="px-3 py-3 text-sm">{label}</div>
            <div className="break-words px-3 py-3 text-sm">{value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ContactBox({ phone, email, website }: { phone?: string; email?: string; website?: string }) {
  if (!phone && !email && !website) return null
  return (
    <div className="border-t border-[#e7ebef] p-4 text-sm">
      <div className="grid gap-2">
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 text-[#1262ff]"><Phone className="h-4 w-4" /> {phone}</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-[#1262ff]"><Mail className="h-4 w-4" /> Email seller</a> : null}
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#1262ff]"><ExternalLink className="h-4 w-4" /> Website</Link> : null}
      </div>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  return (
    <section className="mt-12">
      <h2 className="mb-5 text-center text-2xl font-extrabold">Latest</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {related.slice(0, 3).map((post, index) => {
          const image = getImages(post)[0] || '/placeholder.svg?height=650&width=900'
          return (
            <Link key={post.id || post.slug} href={buildPostUrl(task, post.slug)} className="overflow-hidden rounded border border-[#dfe4ea] bg-white">
              <div className="flex h-40 items-center justify-center border-b border-[#e7ebef] p-4"><img src={image} alt={post.title} className="max-h-full max-w-full object-contain" /></div>
              <div className="p-4">
                <h3 className="line-clamp-1 text-sm font-semibold">{post.title}</h3>
                
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-8 max-w-[704px] rounded border border-[#dfe4ea] bg-white p-4">
      <h2 className="font-extrabold">Comments</h2>
      <div className="mt-4 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded border border-[#e7ebef] p-3">
            <p className="text-sm font-bold">{comment.name}</p>
            <p className="mt-1 text-sm text-[#4d5560]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[#69717d]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
