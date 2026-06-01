import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import logo from '@/editable/assets/leventakinti-logo.png'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: 'Local login page for this public site.' })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f2f5f9] text-[#102033]">
        <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-[1100px] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#d7e2ed] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#1262ff]">
              <img src={logo.src} alt="" className="h-7 w-7 rounded-full object-cover" />
              Member access
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Sign in to manage your local classified activity.</h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-[#5b6675]">Use your saved local account to return to Leventakinti, browse listings faster, and keep testing the public pages smoothly.</p>
            <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
              {['Local access', 'Fast browsing', 'Saved session'].map((item) => (
                <div key={item} className="rounded-2xl border border-[#d7e2ed] bg-white p-4 text-sm font-bold text-[#102033] shadow-sm">{item}</div>
              ))}
            </div>
          </div>
          <div className="order-1 overflow-hidden rounded-[2rem] border border-[#d7e2ed] bg-white shadow-[0_30px_90px_rgba(14,37,68,0.12)] lg:order-2">
            <div className="bg-[#82cae5] px-6 py-8 text-white sm:px-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#e7ff85]">Welcome back</p>
              <h2 className="mt-2 text-3xl font-extrabold">Login</h2>
              <p className="mt-2 text-sm text-white/85">Continue with your browser-local account.</p>
            </div>
            <div className="p-6 sm:p-8">
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm text-[#5b6675]">New here? <Link href="/signup" className="font-extrabold text-[#1262ff] underline-offset-4 hover:underline">Create an account</Link></p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
