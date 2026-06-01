import Link from 'next/link'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { ArticleListCard, CompactIndexCard, EditorialFeatureCard, RailPostCard, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const categories = [
  ['Auto & Vehicles', '🚌', ['Cars', 'Motorcycles', 'Boats', 'RVs', 'Commercial Trucks', 'Aircrafts', 'Parts & Accessories', 'Everything Else', 'Agents/Dealers', 'Agricultural Equipments']],
  ['Real Estate', '🏡', ['Homes For Sale', 'Homes for Rent', 'Vacation Rentals', 'Office & Commercial', 'Housing Exchange', 'Housing Wanted', 'Rooms & Roommates', 'Land - Plots', 'Agents & Services']],
  ['Jobs', '👔', ['Accounting & Finance', 'Advertising', 'Art & Design & Media', 'Business & Management', 'Cleaning', 'Fashion', 'Healthcare', 'Internet Engineering', 'Legal', 'Manual Labor', 'Marketing', 'Real Estate', 'Retail', 'Sales', 'Technology', 'Telecommunications', 'Transportation & Travel', 'Work at Home']],
  ['Services', '🛠️', ['Auto', 'Child & Elder Care', 'Cleaning Services', 'Computer Services', 'Creative', 'Everything Else', 'Financial', 'Food & Restaurants', 'Health & Beauty', 'Household', 'Landscaping', 'Lessons', 'Moving/Removals', 'Translation', 'Astrology & Vastu Servies']],
  ['Travels', '🚞', ['Tour Packages', 'Travel Agents & Ticketing', 'Hotels, Resorts & Guest Houses', 'Passport & Visa', 'Taxi, Bus & Cas Rentals', 'Other Travel Services']],
  ['Home & Life Style', '🛋️', ['Art, Antiques,Handicrafts', 'Fittings & Furniture', 'Home Appliances', 'Books - Magazines', 'Clothing & Accessories', 'Apparel & Jewellery', 'Sports & Fitness', 'Equipment', 'Kitchen-Cooking']],
  ['Matrimonial', '👰', ['Brides', 'Grooms', 'Marriage Services']],
  ['Community & Events', '🎉', ['Public Announcement', 'Events & Concerts', 'Charity - Donate - NGO', 'Everything Else']],
  ['Electronics/Technology', '💻', ['Accessories', 'AC & Coolers', 'Computers & Laptops', 'Mobiles , Tabs & Ipads', 'Music & Video Players', 'TV & DTH', 'Gaming & Gadgets', 'Office Equipments', 'Security Equipments', 'Others']],
  ['Education-Learning', '📚', ['Career Counseling', 'Schools & Universities', 'Correspondence , Distance Learning', 'Short & Long term Courses', 'Study Materials']],
]

function locationOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const value = ['location', 'city', 'regions', 'country', 'address'].map((key) => content[key]).find((item) => typeof item === 'string' && item)
  return typeof value === 'string' ? value : '-'
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const category = typeof content.category === 'string' ? content.category.trim() : ''
  return category || post?.tags?.[0] || 'Classified'
}

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

function buildDirectoryGroups(posts: SitePost[], timeSections: HomeTimeSection[]) {
  const sectionPosts = timeSections.flatMap((section) => section.posts || [])
  const sourcePosts = uniquePosts([...posts, ...sectionPosts])
  const groups = new Map<string, SitePost[]>()

  sourcePosts.forEach((post) => {
    const category = categoryOf(post)
    const existing = groups.get(category) || []
    groups.set(category, [...existing, post])
  })

  return Array.from(groups.entries()).map(([name, items]) => ({ name, items }))
}

export function EditableHomeHero(_props: HomeSectionProps) {
  return (
    <section className="bg-[#82cae5]">
      <div className="mx-auto max-w-[1100px] px-4 py-20 text-center text-white sm:px-6 lg:py-24">
        <h2 className="text-2xl font-extrabold">Search, Sell &amp; Buy</h2>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight sm:text-[42px]">
          <span className="text-[#e7ff85]">Best classifieds</span> for you
        </h1>
        <p className="mx-auto mt-3 max-w-5xl text-base">We are leading online classified platform. Our aim is to empower every person in the country to independently connect with buyers and sellers online.</p>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  return (
    <section className="bg-[#f2f5f9]">
      <div className="mx-auto max-w-[1100px] px-4 py-9 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-[#252a31]">Browse categories</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {categories.slice(0, 10).map(([name, icon], index) => {
            const post = railPosts[index]
            return post ? <RailPostCard key={String(name)} post={{ ...post, tags: [String(name)] }} href={postHref(primaryTask, post, primaryRoute)} index={index} /> : (
              <Link key={String(name)} href={primaryRoute} className="block w-[90px] rounded border border-[#dfe4ea] bg-white px-2 py-6 text-center transition hover:-translate-y-0.5 hover:shadow-sm sm:w-[90px]">
                <span className="mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-full border border-[#e2e7ed] text-3xl">{icon}</span>
                <span className="mt-4 block text-[10px] font-bold leading-4 text-black">{String(name)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts[0]
  const latest = posts.slice(1, 9)
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-[#252a31]">Featured listings</h2>
        <div className="mt-8 flex items-start justify-between gap-6">
          <div className="w-full max-w-[348px]">{featured ? <EditorialFeatureCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} /> : null}</div>
          <Link href={primaryRoute} className="hidden text-sm text-[#333] hover:text-blue-700 sm:block">View All</Link>
        </div>
      </div>

      <div className="bg-[#f2f5f9]">
        <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6">
          <div className="flex items-center justify-center sm:justify-between">
            <span />
            <h2 className="text-center text-3xl font-extrabold text-[#252a31]">Latest</h2>
            <Link href={primaryRoute} className="hidden text-sm text-[#333] hover:text-blue-700 sm:block">View All</Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((post, index) => (
              <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group overflow-hidden rounded border border-[#dfe4ea] bg-white transition hover:-translate-y-0.5 hover:shadow-sm">
                <div className="flex h-[200px] items-center justify-center border-b border-[#e7ebef] bg-white p-4">
                  <img src={getEditablePostImage(post)} alt={post.title} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 text-sm font-semibold text-[#3b3f45]">{post.title}</h3>
                </div>
                <div className="border-t border-[#e7ebef] px-4 py-3 text-sm text-[#333]">{locationOf(post)}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const mixed = posts.slice(9, 15)
  const directoryGroups = buildDirectoryGroups(posts, timeSections)
  return (
    <section className="bg-[#f2f5f9]">
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
        {mixed.length ? (
          <div className="mb-14 grid gap-5 md:grid-cols-2">
            {mixed.slice(0, 4).map((post, index) => index % 2 === 0
              ? <ArticleListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              : <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            )}
          </div>
        ) : null}
        <div className="grid gap-x-16 gap-y-8 md:grid-cols-3">
          {directoryGroups.map(({ name, items }, groupIndex) => (
            <div key={name} className="break-inside-avoid">
              <Link href={primaryRoute} className="mb-3 flex items-center gap-6 rounded border border-[#cfd5dc] bg-white px-4 py-3 font-bold text-black">
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded bg-[#eef2f6] text-xs font-bold">
                  <img src={getEditablePostImage(items[0])} alt="" className="h-full w-full object-cover" />
                </span>
                <span>{name}</span>
              </Link>
              <div className="mb-5 grid gap-3 pl-4 text-sm text-[#14181d]">
                {items.slice(0, groupIndex === 0 ? 12 : 10).map((post) => (
                  <Link key={post.id || post.slug || post.title} href={postHref(primaryTask, post, primaryRoute)} className="line-clamp-1 hover:text-blue-700">
                    {post.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return null
}
