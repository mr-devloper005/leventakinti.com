import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f2f5f9',
  '--slot4-page-text': '#252a31',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#4d5560',
  '--slot4-soft-muted-text': '#69717d',
  '--slot4-accent': '#2f73f6',
  '--slot4-accent-fill': '#2f73f6',
  '--slot4-accent-soft': '#e8f3d9',
  '--slot4-dark-bg': '#111111',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#eef2f6',
  '--slot4-cream': '#ffffff',
  '--slot4-warm': '#82cae5',
  '--slot4-lavender': '#f2f5f9',
  '--slot4-gray': '#f2f5f9',
  '--slot4-body-gradient': 'none',
  '--editable-container': '1100px',
  '--editable-border': '#dfe4ea',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[#e7ff85]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[#dfe4ea]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-none',
  overlay: 'bg-black/35',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6',
    sectionY: 'py-10 sm:py-12',
  },
  layout: {
    safeGrid: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
    featureGrid: 'grid gap-6 lg:grid-cols-[1fr_340px]',
    rail: 'flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[160px] shrink-0 snap-start',
  },
  type: {
    eyebrow: 'text-xs font-bold uppercase',
    heroTitle: 'text-3xl font-extrabold leading-tight sm:text-4xl',
    sectionTitle: 'text-3xl font-extrabold tracking-tight',
    body: 'text-base leading-7',
  },
  surface: {
    card: `rounded border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded border ${editablePalette.border} bg-white ${editablePalette.pageText}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center rounded border border-black bg-white px-7 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white',
    secondary: 'inline-flex items-center justify-center rounded border border-[#dfe4ea] bg-white px-7 py-3 text-sm font-bold text-black transition hover:border-black',
    accent: 'inline-flex items-center justify-center rounded bg-[#2f73f6] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#165ee6]',
  },
  media: {
    frame: `relative overflow-hidden rounded-none ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-200 hover:-translate-y-0.5 hover:shadow-sm',
    fade: 'transition duration-200 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Keep data and routing untouched; only the editable visual layer changes.',
  'Use the classified reference rhythm: small centered header, large blue search hero, pale gray listing bands, simple bordered cards.',
  'Posts must render safely when images, summary, or category data are missing.',
] as const
