import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const storeLink = "https://chromewebstore.google.com/detail/WebnovelSync/gnemgbbfllodlnbioibbgkfkbpblphne";

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setVisible(prev => { const n = new Set(Array.from(prev)); n.add(e.target.id); return n; });
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-r]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }),
      { threshold: 0.5 }
    );
    obs.observe(v);
    return () => obs.unobserve(v);
  }, []);

  const show = (id: string) => visible.has(id);

  const platforms = [
    { name: 'ScribbleHub', logo: 'https://forum.scribblehub.com/attachments/1726347228980-png.31246/' },
    { name: 'RoyalRoad', logo: 'https://www.royalroad.com/dist/img/logo/rr-logo-gold-white-small-min.png' },
    { name: 'Webnovel', logo: 'https://img.icons8.com/color/48/webnovel.png' },
    { name: 'FanFiction.net', logo: 'https://upload.wikimedia.org/wikipedia/en/d/de/FanFiction.net_logo.png' },
    { name: 'Archive of Our Own', logo: 'https://archiveofourown.org/images/ao3_logos/logo_42.png' },
    { name: 'Wattpad', logo: 'https://play-lh.googleusercontent.com/jHpUNfMZ38itTSOUMWgqzki0aIaSWtQeDwzWQbE2_lWrtYZSRQk8u18gCxvrTFFemGyS' },
    { name: 'Inkitt', logo: 'https://inkitt.zendesk.com/hc/theming_assets/01HZM3W7R6F42D9HG8V1SR0M7T' },
    { name: 'Tapas', logo: 'https://us-a.tapas.io/resources/images/tapastic-touch-icon.png' }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(16px) saturate(180%)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="/webnovelsync-icon.png" alt="" className="w-7 h-7" />
            <span className="font-body text-sm font-500 tracking-wide uppercase" style={{ letterSpacing: '0.15em' }}>WebnovelSync</span>
          </Link>
          <div className="flex items-center gap-10">
            <a href="#demo" className="hidden md:block font-mono text-xs uppercase tracking-widest transition-colors duration-300" style={{ color: 'var(--color-text-faint)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}>Demo</a>
            <a href="#platforms" className="hidden md:block font-mono text-xs uppercase tracking-widest transition-colors duration-300" style={{ color: 'var(--color-text-faint)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}>Platforms</a>
            <a
              href={storeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: 'var(--color-blue)', color: '#000', fontWeight: 500 }}
            >
              Install
            </a>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col justify-center px-8 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--color-blue-glow) 0%, transparent 70%)' }} />

        <div className="relative max-w-[1400px] mx-auto w-full">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-16 items-center">
            <div>
              <div className="reveal-up delay-1">
                <span className="font-mono text-xs uppercase tracking-[0.3em] inline-block px-3 py-1.5 rounded-full" style={{ color: 'var(--color-blue)', border: '1px solid var(--color-blue-dim)', background: 'var(--color-blue-dim)' }}>
                  Free Chrome Extension
                </span>
              </div>

              <h1 className="font-display mt-10 reveal-up delay-2" style={{ fontSize: 'clamp(3.2rem, 7vw, 6.5rem)', lineHeight: '1.05', letterSpacing: '-0.03em' }}>
                Write once,<br />
                <em className="font-display" style={{ color: 'var(--color-blue)' }}>publish everywhere.</em>
              </h1>

              <p className="mt-8 text-lg leading-relaxed max-w-md reveal-up delay-3" style={{ color: 'var(--color-text-dim)' }}>
                Cross-post your web novels to eight platforms with a single click. No more copy-pasting between tabs.
              </p>

              <div className="flex flex-wrap gap-4 mt-10 reveal-up delay-4">
                <a
                  href={storeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-7 py-4 rounded-full font-body font-500 transition-all duration-300 hover:scale-[1.03] blue-glow"
                  style={{ background: 'var(--color-blue)', color: '#000' }}
                >
                  Add to Chrome
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-full font-body transition-all duration-300"
                  style={{ border: '1px solid var(--color-border-hover)', color: 'var(--color-text-dim)' }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-blue)', animation: 'breathe 2.5s ease-in-out infinite' }} />
                  Watch demo
                </a>
              </div>
            </div>

            <div className="hidden md:block relative h-[500px] reveal-fade delay-5">
              {platforms.map((p, i) => {
                const positions = [
                  { top: '5%', left: '15%' },
                  { top: '12%', left: '60%' },
                  { top: '32%', left: '5%' },
                  { top: '38%', left: '50%' },
                  { top: '55%', left: '25%' },
                  { top: '62%', left: '65%' },
                  { top: '80%', left: '35%' },
                  { top: '86%', left: '70%' },
                ];
                const pos = positions[i] || { top: `${(i * 12) % 90}%`, left: `${(i * 23) % 70}%` };
                return (
                  <div
                    key={p.name}
                    className="absolute group hover-lift cursor-default"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      animation: `revealUp 0.8s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.12}s both`,
                    }}
                  >
                    <div
                      className="flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-md transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--color-border)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-blue)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    >
                      <img src={p.logo} alt="" className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span className="font-mono text-xs tracking-wide whitespace-nowrap" style={{ color: 'var(--color-text-dim)' }}>{p.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 reveal-fade delay-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--color-text-faint)' }}>Scroll</span>
          <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, var(--color-text-faint), transparent)' }} />
        </div>
      </section>

      <section id="marquee" data-r className="py-5 overflow-hidden" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center shrink-0">
              {platforms.map((p) => (
                <React.Fragment key={`${copy}-${p.name}`}>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] whitespace-nowrap px-10 transition-opacity duration-300 hover:opacity-100" style={{ color: 'var(--color-text-faint)' }}>
                    {p.name}
                  </span>
                  <span style={{ color: 'var(--color-blue)', opacity: 0.3 }}>&bull;</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="demo" data-r className="py-32 px-8">
        <div className={`max-w-[1400px] mx-auto transition-all duration-1000 ${show('demo') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex items-center gap-6 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--color-text-faint)' }}>01 / Demo</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <div className="grid lg:grid-cols-[1fr_1.8fr] gap-20 items-start">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-display text-4xl md:text-5xl" style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                <em style={{ color: 'var(--color-blue)' }}>See</em> how<br />it works.
              </h2>
              <p className="mt-6 leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
                Chapters flow from one platform to all the others. No copy-pasting. No tab-switching. Just sync.
              </p>
            </div>

            <div className="relative">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
                  <span className="ml-4 font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-text-faint)' }}>webnovelsync demo</span>
                </div>
                <video
                  ref={videoRef}
                  className="w-full h-auto block"
                  controls
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="https://media.webnovelsync.com/webnovel-scribblehub.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" data-r className="py-32 px-8" style={{ background: 'var(--color-surface)' }}>
        <div className={`max-w-[1400px] mx-auto transition-all duration-1000 ${show('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex items-center gap-6 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--color-text-faint)' }}>02 / Features</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: 'Sync',
                title: 'One-click\nposting',
                desc: 'Extract chapters from any source and post to all destinations simultaneously.',
              },
              {
                label: 'Batch',
                title: 'Multi-chapter\nuploads',
                desc: 'Upload dozens of chapters at once. Perfect for backlogs.',
              },
              {
                label: 'Track',
                title: 'Progress\nmonitoring',
                desc: 'Know exactly which chapters are posted where. Never lose progress.',
              },
            ].map((f) => (
              <div
                key={f.label}
                className="group relative p-10 rounded-2xl hover-lift cursor-default"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-blue)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--color-blue)' }}>{f.label}</span>
                <h3 className="font-display text-3xl mt-6 mb-6 whitespace-pre-line" style={{ lineHeight: '1.15' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="platforms" data-r className="py-32 px-8">
        <div className={`max-w-[1400px] mx-auto transition-all duration-1000 ${show('platforms') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex items-center gap-6 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--color-text-faint)' }}>03 / Platforms</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-20 items-start">
            <div>
              <h2 className="font-display text-4xl md:text-5xl" style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                Eight platforms,<br /><em style={{ color: 'var(--color-blue)' }}>zero limits.</em>
              </h2>
              <p className="mt-6 leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
                Every platform is included free. No premium tiers. No feature gates. No hidden costs.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {platforms.map((p) => (
                <div
                  key={p.name}
                  className="group flex items-center gap-4 p-5 rounded-xl transition-all duration-300 cursor-default"
                  style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-hover)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <img src={p.logo} alt="" className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <div>
                    <span className="text-sm font-500">{p.name}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--color-blue)' }}>Free</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="steps" data-r className="py-32 px-8" style={{ background: 'var(--color-surface)' }}>
        <div className={`max-w-[1400px] mx-auto transition-all duration-1000 ${show('steps') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex items-center gap-6 mb-16">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--color-text-faint)' }}>04 / Process</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          <div className="grid lg:grid-cols-3 gap-0" style={{ border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden' }}>
            {[
              { num: '01', title: 'Install', desc: 'Add WebnovelSync to Chrome. Free, under 10 seconds.' },
              { num: '02', title: 'Navigate', desc: 'Go to your story\'s table of contents on any supported platform.' },
              { num: '03', title: 'Sync', desc: 'Select chapters, choose destinations, click once. Done.' },
            ].map((step, i) => (
              <div
                key={step.num}
                className="group p-12 transition-all duration-300"
                style={{
                  background: 'var(--color-card)',
                  borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <span className="font-mono text-5xl font-500 block mb-8 transition-colors duration-300" style={{ color: 'var(--color-border)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-blue)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-border)'}
                >
                  {step.num}
                </span>
                <h3 className="font-display text-3xl mb-4">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" data-r className="relative py-40 px-8 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, var(--color-blue-glow) 0%, transparent 60%)' }} />

        <div className={`relative max-w-3xl mx-auto text-center transition-all duration-1000 ${show('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', lineHeight: '1.05', letterSpacing: '-0.03em' }}>
            Your stories<br />
            <em style={{ color: 'var(--color-blue)' }}>deserve reach.</em>
          </h2>
          <p className="mt-8 text-lg" style={{ color: 'var(--color-text-dim)' }}>
            Free forever. No account needed.
          </p>
          <a
            href={storeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 mt-12 px-10 py-5 rounded-full text-lg font-500 transition-all duration-300 hover:scale-[1.03] blue-glow"
            style={{ background: 'var(--color-blue)', color: '#000' }}
          >
            Get started
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

      <footer className="py-10 px-8" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/webnovelsync-icon.png" alt="" className="w-5 h-5 opacity-40" />
            <span className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--color-text-faint)' }}>WebnovelSync</span>
          </div>
          <div className="flex items-center gap-8 font-mono text-xs" style={{ color: 'var(--color-text-faint)' }}>
            <Link to="/privacy" className="hover:opacity-100 transition-opacity uppercase tracking-wider">Privacy</Link>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
