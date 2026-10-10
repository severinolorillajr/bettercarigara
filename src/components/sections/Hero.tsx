import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Landmark } from 'lucide-react';

// ponytail: placeholder photos from picsum.photos — swap for real Carigara
// shots (drop them in public/images/ and use '/images/foo.jpg').
const SLIDES = [
  { src: 'https://picsum.photos/seed/carigara-bay/1920/1080', alt: 'Bay view' },
  { src: 'https://picsum.photos/seed/carigara-town/1920/1080', alt: 'Town' },
  { src: 'https://picsum.photos/seed/carigara-hills/1920/1080', alt: 'Hills' },
];

export default function Hero() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive(i => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-primary-900 text-white">
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          aria-hidden={i !== active}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 -z-10 h-full w-full object-cover transition-all duration-[1500ms] ease-out ${
            i === active ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-900/90 via-primary-800/70 to-primary-700/30" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-primary-900/60 to-transparent" />

      <div className="container mx-auto px-4 py-24 md:py-36 lg:py-44">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium uppercase tracking-wider backdrop-blur-sm ring-1 ring-white/25">
            <Landmark className="h-4 w-4" />
            Welcome to
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight drop-shadow-sm md:text-6xl lg:text-7xl">
            {import.meta.env.VITE_GOVERNMENT_NAME}
          </h1>
          <p className="mt-5 text-lg text-white/90 md:text-xl">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-3 font-semibold text-white shadow-lg shadow-accent-900/30 transition hover:-translate-y-0.5 hover:bg-accent-400"
            >
              {t('services.title')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/government"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/40 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Government
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === active}
            className={`h-2 rounded-full transition-all ${
              i === active
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
