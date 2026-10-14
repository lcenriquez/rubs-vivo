import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  BookOpen,
  Droplets,
  HeartPulse,
  MapPin,
  Mountain,
  Recycle,
  Sprout,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Highlight = { value: string; label: string };

function InfoCard({
  icon: Icon,
  title,
  children,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  tone: 'problem' | 'solution';
}) {
  return (
    <div
      className={cn(
        'rounded-3xl border p-6 shadow-sm',
        tone === 'problem'
          ? 'border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20'
          : 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/30'
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl',
          tone === 'problem'
            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function SectionLabel({ children, tone }: { children: React.ReactNode; tone: 'problem' | 'solution' }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wider',
        tone === 'problem'
          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
      )}
    >
      {children}
    </span>
  );
}

export default async function CompostingToiletPage() {
  const t = await getTranslations('compostingToilet');
  const highlights = t.raw('highlights') as Highlight[];

  return (
    <div className="flex flex-col">
      {/* Encabezado */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-lime-800 text-white">
        <div className="absolute inset-0 -z-10 opacity-20">
          <Image src="/img/composting-process.jpg" alt="" fill className="object-cover" preload />
        </div>
        <div className="container px-4 py-16 md:py-24 text-center max-w-4xl">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-lime-200 ring-1 ring-white/20">
            {t('eyebrow')}
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-balance md:text-5xl">{t('title')}</h1>
          <p className="mt-6 text-lg text-emerald-50/90 md:text-xl text-balance">{t('subtitle')}</p>
        </div>
      </section>

      {/* Introducción */}
      <section className="py-16">
        <div className="container px-4 grid items-center gap-10 lg:grid-cols-2 max-w-6xl">
          <p className="text-lg leading-relaxed md:text-xl first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-extrabold first-letter:text-emerald-600 dark:first-letter:text-emerald-400">
            {t('introduction')}
          </p>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-white p-4 shadow-xl">
            <Image src="/img/nutrient-cycle.svg" alt={t('images.nutrientCycle')} fill className="object-contain p-4" />
          </div>
        </div>
      </section>

      {/* El problema */}
      <section className="bg-muted/60 py-16 md:py-20">
        <div className="container px-4 max-w-6xl">
          <div className="text-center">
            <SectionLabel tone="problem">{t('problemLabel')}</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold text-balance md:text-4xl">{t('conventionalSystems.title')}</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <InfoCard tone="problem" icon={Droplets} title={t('conventionalSystems.nutrientCycle.title')}>
              <p>{t('conventionalSystems.nutrientCycle.description')}</p>
            </InfoCard>
            <InfoCard tone="problem" icon={Mountain} title={t('conventionalSystems.soilDegradation.title')}>
              <p>{t('conventionalSystems.soilDegradation.description')}</p>
            </InfoCard>
            <InfoCard tone="problem" icon={HeartPulse} title={t('conventionalSystems.healthRisks.title')}>
              <p>{t('conventionalSystems.healthRisks.description')}</p>
            </InfoCard>
          </div>

          <figure className="relative mt-10 h-64 w-full overflow-hidden rounded-3xl md:h-96">
            <Image src="/img/water-pollution.jpg" alt={t('images.waterPollution')} fill className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-lg font-semibold text-white">
              {t('images.waterPollution')}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* La solución */}
      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-6xl">
          <div className="text-center">
            <SectionLabel tone="solution">{t('solutionLabel')}</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold text-balance md:text-4xl">{t('solution.title')}</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <InfoCard tone="solution" icon={Recycle} title={t('solution.benefits.title')}>
              <p>{t('solution.benefits.description')}</p>
            </InfoCard>
            <InfoCard tone="solution" icon={Sprout} title={t('solution.soilHealth.title')}>
              <p>{t('solution.soilHealth.description')}</p>
            </InfoCard>
          </div>

          {/* Cifras destacadas */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.value} className="rounded-3xl bg-emerald-900 p-6 text-center text-emerald-50 shadow-lg dark:bg-emerald-950 dark:ring-1 dark:ring-emerald-800">
                <p className="text-4xl font-extrabold text-lime-300">{item.value}</p>
                <p className="mt-2 text-sm text-emerald-100/90">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm italic text-muted-foreground">{t('solution.benefits.stats')}</p>

          <figure className="relative mt-10 h-64 w-full overflow-hidden rounded-3xl md:h-96">
            <Image src="/img/composting-process.jpg" alt={t('images.compostingProcess')} fill className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-lg font-semibold text-white">
              {t('images.compostingProcess')}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* La única solución sustentable */}
      <section className="pb-16">
        <div className="container px-4 max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-lime-700 p-8 text-white shadow-2xl md:p-12">
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-lime-300/20 blur-2xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
                <Star className="h-3.5 w-3.5" /> {t('onlyBanner.title')}
              </span>
              <h2 className="mt-4 text-2xl font-bold md:text-4xl">{t('future.title')}</h2>
              <p className="mt-4 max-w-3xl text-lg text-emerald-50/90">{t('onlyBanner.text')}</p>
              <p className="mt-4 max-w-3xl text-emerald-50/80">{t('future.description')}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/#unica" className={cn(buttonVariants({ size: 'lg' }), 'rounded-full bg-white text-emerald-800 hover:bg-emerald-50')}>
                  {t('onlyBanner.ctaCompare')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/map" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'rounded-full border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white')}>
                  <MapPin className="mr-2 h-4 w-4" /> {t('onlyBanner.ctaMap')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referencias */}
      <section className="border-t bg-muted/40 py-12">
        <div className="container px-4 max-w-6xl">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" /> {t('citations.title')}
          </h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {[1, 2, 3, 4, 5].map((index) => (
              <li key={index} className="flex gap-3 rounded-2xl border bg-card p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {index}
                </span>
                <a
                  href={t(`citations.${index}.url`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-emerald-700 hover:underline dark:hover:text-emerald-400"
                >
                  {t(`citations.${index}.text`)}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
