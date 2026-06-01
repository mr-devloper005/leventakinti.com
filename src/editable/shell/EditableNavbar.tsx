'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import logo from '@/editable/assets/leventakinti-logo.png'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const links = [
    ['Register', '/signup'],
    ['Login', '/login'],
  ]

  useEffect(() => {
    const selector = "link[rel='icon']"
    let favicon = document.querySelector<HTMLLinkElement>(selector)
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.appendChild(favicon)
    }
    favicon.href = logo.src
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[#eef1f5] bg-white text-black">
      <nav className="mx-auto flex min-h-[60px] w-full max-w-[1100px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 leading-none">
          <img src={logo.src} alt="Leventakinti" className="h-14 w-14 rounded-full object-cover" />
          <span className="block text-center font-serif text-lg font-bold leading-[0.9] text-[#0b2341]">Leventakinti</span>
        </Link>

        <div className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-blue-700">{label}</Link>)}
          <Link href="/classified" className="rounded-full border border-black px-6 py-3 hover:bg-black hover:text-white">Classified</Link>
          <Link href="/contact" className="rounded-full border border-black px-6 py-3 hover:bg-black hover:text-white">Contact</Link>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="rounded border border-black p-2 md:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-[#eef1f5] bg-white px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-[1100px] gap-2">
            {[...links, ['Post an ad', '/classified'], ['Post A Banner Ad', '/contact']].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded border border-[#dfe4ea] px-4 py-3 text-sm font-semibold">
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
