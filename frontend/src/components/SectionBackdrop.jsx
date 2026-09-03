export default function SectionBackdrop({ src, position = 'center' }) {
  return (
    <>
      <img src={src} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position }} />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/[0.96] via-slate-950/[0.88] to-brand-950/[0.78]" />
      <div className="absolute inset-0 grid-bg opacity-30" />
    </>
  )
}
