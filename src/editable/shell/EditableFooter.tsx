'use client'

import Link from 'next/link'
<<<<<<< feature/complete_layout_change
import logo from '@/editable/assets/leventakinti-logo.png'

export function EditableFooter() {
  const links = [
    ['Home', '/'],
    ['About', '/about'],
    ['Contact', '/contact'],
    ['Classified', '/classified'],
    ['Sign in', '/login'],
    ['Sign up', '/signup'],
  ]
=======
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = { '--editable-footer-bg': 'var(--editable-page-bg, #fffaf3)', '--editable-footer-text': 'var(--editable-page-text, #241915)' } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
>>>>>>> dev

  return (
    <footer className="bg-white text-sm text-[#1262ff]">
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3 text-blue-700">
          <img src={logo.src} alt="Leventakinti" className="h-20 w-20 rounded-full object-cover" />
          <span className="font-serif text-lg font-bold">Leventakinti</span>
        </Link>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 border-b border-[#edf0f3] pb-12 font-semibold">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-blue-800">
              {label}
            </Link>
          ))}
        </div>
<<<<<<< feature/complete_layout_change
=======

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.22em] opacity-55">Explore</h3>
          <div className="mt-4 grid gap-2">
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-bold opacity-75 hover:opacity-100">
                {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.22em] opacity-55">Site</h3>
          <div className="mt-4 grid gap-2">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-bold opacity-75 hover:opacity-100">{label}</Link>
            ))}
            {session ? <button type="button" onClick={logout} className="text-left text-sm font-bold opacity-75 hover:opacity-100">Logout</button> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--editable-border)] px-4 py-5 text-center text-xs font-bold opacity-55">
        © {year} {SITE_CONFIG.name}. All rights reserved.
>>>>>>> dev
      </div>
    </footer>
  )
}
