const set = (sel: string, make: () => HTMLElement, attr: string, val: string) => { let el = document.head.querySelector(sel) as HTMLElement | null; if (!el) { el = make(); document.head.appendChild(el) } el.setAttribute(attr, val) }
const meta = (key: string, v: string, prop = false) => set(`meta[${prop ? 'property' : 'name'}="${key}"]`, () => { const m = document.createElement('meta'); m.setAttribute(prop ? 'property' : 'name', key); return m }, 'content', v)
export function setSEO(title: string, desc: string, url: string, image?: string) {
  document.title = title; meta('description', desc.slice(0, 160)); meta('og:title', title, true); meta('og:description', desc.slice(0, 160), true); meta('og:type', 'product', true); meta('og:url', url, true); if (image) meta('og:image', image, true)
  set('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l }, 'href', url)
}
