'use client'

import Link from 'next/link'
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

  return (
    <footer className="bg-white text-sm text-[#1262ff]">
      <div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3 text-[#0b2341]">
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
      </div>
    </footer>
  )
}
