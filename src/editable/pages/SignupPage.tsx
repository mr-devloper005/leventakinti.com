import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import logo from '@/editable/assets/leventakinti-logo.png'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f2f5f9] text-[#102033]">
        <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-[1100px] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[#d7e2ed] bg-white shadow-[0_30px_90px_rgba(14,37,68,0.12)]">
            <div className="bg-[#82cae5] px-6 py-8 text-white sm:px-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#e7ff85]">Create access</p>
              <h1 className="mt-2 text-3xl font-extrabold">Register</h1>
              <p className="mt-2 text-sm text-white/85">Start with a browser-local profile for this site.</p>
            </div>
            <div className="p-6 sm:p-8">
              <EditableLocalSignupForm />
              <p className="mt-5 text-sm text-[#5b6675]">Already have an account? <Link href="/login" className="font-extrabold text-[#1262ff] underline-offset-4 hover:underline">Login</Link></p>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#d7e2ed] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#1262ff]">
              <img src={logo.src} alt="" className="h-7 w-7 rounded-full object-cover" />
              Leventakinti access
            </div>
            <h2 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Create a simple account for browsing classifieds.</h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-[#5b6675]">Register locally to test sign-in flows and keep the public classifieds experience connected without changing backend behavior.</p>
            <div className="mt-8 rounded-[2rem] border border-[#d7e2ed] bg-white p-5 shadow-sm">
              <p className="text-sm font-extrabold text-[#102033]">What you get</p>
              <div className="mt-4 grid gap-3 text-sm text-[#5b6675]">
                <span>Browse classified pages with a signed-in state.</span>
                <span>Keep the session in local browser storage.</span>
                <span>Return to the homepage automatically after signup.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
