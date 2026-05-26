export type SlideLayout = 'title' | 'content' | 'split' | 'numeric' | 'quote' | 'grid' | 'comparison' | 'timeline' | 'hero';

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  bullets?: string[];
  paragraphs?: string[];
  statNumber?: string;
  statLabel?: string;
  quoteText?: string;
  quoteAuthor?: string;
}

export interface Presentation {
  id: string;
  title: string;
  themeId: string;
  slides: Slide[];
}

export interface PresentationTheme {
  id: string;
  name: string;
  bg: string; // Tailwind class or custom hex
  text: string;
  accent: string;
  fontFamily: string; // e.g. sans, serif, mono
  headingFont: string;
  cardBg: string;
  border: string;
  cornerBorder: string; // Tailwind border-color class for Geometric Balance corner decoration
}

export const THEMES: Record<string, PresentationTheme> = {
  geometric: {
    id: 'geometric',
    name: 'Geometric Balance',
    bg: 'bg-white',
    text: 'text-slate-900',
    accent: 'text-indigo-600 bg-indigo-600',
    fontFamily: 'font-sans',
    headingFont: 'font-display font-black tracking-tight text-slate-900 leading-tight',
    cardBg: 'bg-white border-slate-200 shadow-xl',
    border: 'border-indigo-100',
    cornerBorder: 'border-indigo-600'
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Slate',
    bg: 'bg-slate-950',
    text: 'text-slate-100',
    accent: 'text-cyan-400 bg-cyan-400',
    fontFamily: 'font-sans',
    headingFont: 'font-sans tracking-tight font-extrabold',
    cardBg: 'bg-slate-900/60 border-slate-800',
    border: 'border-cyan-500/20',
    cornerBorder: 'border-cyan-400'
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Light',
    bg: 'bg-zinc-50',
    text: 'text-zinc-900',
    accent: 'text-indigo-600 bg-indigo-600',
    fontFamily: 'font-sans',
    headingFont: 'font-sans tracking-tight font-bold',
    cardBg: 'bg-white border-zinc-200 shadow-sm',
    border: 'border-indigo-100',
    cornerBorder: 'border-indigo-600'
  },
  editorial: {
    id: 'editorial',
    name: 'Warm Sand',
    bg: 'bg-orange-50/50',
    text: 'text-stone-900',
    accent: 'text-amber-800 bg-amber-800',
    fontFamily: 'font-serif',
    headingFont: 'font-serif font-semibold tracking-wide',
    cardBg: 'bg-stone-100/50 border-stone-200',
    border: 'border-amber-900/10',
    cornerBorder: 'border-amber-800'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyber',
    bg: 'bg-black',
    text: 'text-zinc-100',
    accent: 'text-yellow-400 bg-yellow-400',
    fontFamily: 'font-mono',
    headingFont: 'font-mono font-bold tracking-tight',
    cardBg: 'bg-zinc-900/80 border-yellow-400/20',
    border: 'border-yellow-400/30',
    cornerBorder: 'border-yellow-400'
  },
  forest: {
    id: 'forest',
    name: 'Mint Forest',
    bg: 'bg-emerald-950',
    text: 'text-emerald-50',
    accent: 'text-teal-300 bg-teal-300',
    fontFamily: 'font-sans',
    headingFont: 'font-serif tracking-tight font-medium',
    cardBg: 'bg-emerald-900/30 border-emerald-800',
    border: 'border-teal-500/20',
    cornerBorder: 'border-teal-300'
  }
};
