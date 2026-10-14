import React from "react";
import { getTranslations } from 'next-intl/server';
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  BookOpen,
  CircleCheck,
  CircleMinus,
  CircleX,
  Droplets,
  ExternalLink,
  Factory,
  Fish,
  Layers,
  MapPin,
  Recycle,
  Repeat,
  ShoppingBag,
  Sparkles,
  Sprout,
  Toilet,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NutrientCycle } from "@/components/home/nutrient-cycle";
import { DryToiletDiagram } from "@/components/home/dry-toilet-diagram";

type Mark = "yes" | "partial" | "no";
type Option = { name: string; marks: Mark[] };
type Step = { title: string; text: string };
type Stat = { value: string; unit: string; label: string };
type Myth = { myth: string; fact: string };
type Story = { name: string; place: string; highlight: string; text: string; url: string; linkLabel: string };
type Resource = { title: string; description: string; url: string };

const markStyles: Record<Mark, { icon: LucideIcon; className: string }> = {
  yes: { icon: CircleCheck, className: "text-emerald-600 dark:text-emerald-400" },
  partial: { icon: CircleMinus, className: "text-amber-500" },
  no: { icon: CircleX, className: "text-rose-500" },
};

const drainIcons: LucideIcon[] = [Droplets, Factory, Waves, Fish];
const dryIcons: LucideIcon[] = [Toilet, Layers, Recycle, Sprout];
const stepIcons: LucideIcon[] = [Layers, Toilet, Sparkles, Repeat];
const resourceIcons: LucideIcon[] = [BookOpen, ShoppingBag, Toilet];

function SectionHeading({ eyebrow, title, description, className }: { eyebrow?: string; title: string; description?: string; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-lg text-muted-foreground text-balance">{description}</p>}
    </div>
  );
}

function Tank() {
  return (
    <svg viewBox="0 0 24 32" className="h-10 w-8 sm:h-12 sm:w-9" aria-hidden="true">
      <rect x="3" y="2" width="18" height="3" rx="1.5" className="fill-slate-700 dark:fill-slate-300" />
      <rect x="2" y="5" width="20" height="25" rx="4" className="fill-slate-800 dark:fill-slate-200" />
      <rect x="4" y="12" width="16" height="16" rx="3" className="fill-sky-400" />
      <path d="M4 16 h16" className="stroke-sky-200" strokeWidth="1" />
    </svg>
  );
}

export default async function Home() {
  const t = await getTranslations('home');

  const stats = t.raw('stats.items') as Stat[];
  const criteria = t.raw('only.criteria') as string[];
  const options = t.raw('only.options') as Option[];
  const drainSteps = t.raw('paths.drain.steps') as Step[];
  const drySteps = t.raw('paths.dry.steps') as Step[];
  const howSteps = t.raw('howItWorks.steps') as Step[];
  const mixItems = t.raw('howItWorks.mix.items') as string[];
  const myths = t.raw('myths.items') as Myth[];
  const stories = t.raw('stories.items') as Story[];
  const resources = t.raw('resources.items') as Resource[];

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 via-lime-50/60 to-background dark:from-emerald-950 dark:via-emerald-950/40 dark:to-background" />
        <div className="absolute inset-0 -z-10 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-lime-300/30 blur-3xl dark:bg-lime-500/10" />
        <div className="absolute top-1/2 -left-32 -z-10 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10" />

        <div className="container px-4 py-12 md:py-20 grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
              <Sprout className="h-4 w-4" /> {t('hero.badge')}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl xl:text-6xl">
              {t('hero.title')}{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-lime-300">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl text-balance">
              {t('hero.description')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/composting-toilet" className={cn(buttonVariants({ size: "xl" }), "rounded-full shadow-lg shadow-emerald-900/20")}>
                {t('hero.ctaLearn')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/map" className={cn(buttonVariants({ size: "xl", variant: "outline" }), "rounded-full bg-background/70")}>
                <MapPin className="mr-2 h-5 w-5" /> {t('hero.ctaMap')}
              </Link>
            </div>
          </div>

          <NutrientCycle
            labels={{
              center: t('hero.cycle.center'),
              soil: t('hero.cycle.soil'),
              food: t('hero.cycle.food'),
              people: t('hero.cycle.people'),
              toilet: t('hero.cycle.toilet'),
              compost: t('hero.cycle.compost'),
            }}
            className="max-w-sm sm:max-w-md"
          />
        </div>

        <a href="#unica" className="mx-auto mb-6 flex w-fit animate-bounce text-emerald-700 dark:text-emerald-400" aria-label="↓">
          <ArrowDown className="h-6 w-6" />
        </a>
      </section>

      {/* Cifras */}
      <section className="bg-emerald-900 text-emerald-50 dark:bg-emerald-950">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className={cn("text-3xl font-extrabold sm:text-4xl md:text-5xl", index === 1 ? "text-sky-300" : "text-lime-300")}>
                    {stat.value}
                  </span>
                  {stat.unit && <span className="text-sm font-semibold text-emerald-200">{stat.unit}</span>}
                </div>
                <p className="mt-2 text-sm text-emerald-100/90 md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-emerald-200/70">{t('stats.footnote')}</p>
        </div>
      </section>

      {/* La única solución sustentable */}
      <section id="unica" className="scroll-mt-20 py-16 md:py-24">
        <div className="container px-4">
          <SectionHeading eyebrow={t('only.eyebrow')} title={t('only.title')} description={t('only.description')} />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {options.map((option, index) => {
              const isDry = index === options.length - 1;
              return (
                <div
                  key={option.name}
                  className={cn(
                    "relative flex flex-col rounded-3xl border p-6 transition-transform",
                    isDry
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-600 to-lime-600 text-white shadow-2xl shadow-emerald-900/30 xl:-translate-y-4 xl:scale-105"
                      : "bg-card"
                  )}
                >
                  {isDry && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950 shadow">
                      ★ {t('only.eyebrow')}
                    </span>
                  )}
                  <h3 className={cn("text-xl font-bold", isDry ? "mt-2" : "")}>{option.name}</h3>
                  <ul className="mt-5 space-y-3">
                    {criteria.map((criterion, i) => {
                      const mark = option.marks[i];
                      const { icon: Icon, className } = markStyles[mark];
                      return (
                        <li key={criterion} className="flex items-start gap-3">
                          <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", isDry ? "text-white" : className)} />
                          <span className={cn("text-sm", isDry ? "font-medium" : mark === "yes" ? "" : "text-muted-foreground")}>
                            {criterion}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
            {(["yes", "partial", "no"] as Mark[]).map((mark) => {
              const { icon: Icon, className } = markStyles[mark];
              return (
                <span key={mark} className="inline-flex items-center gap-1.5">
                  <Icon className={cn("h-4 w-4", className)} /> {t(`only.legend.${mark}`)}
                </span>
              );
            })}
          </div>

          <div className="mx-auto mt-12 max-w-4xl rounded-3xl border-2 border-dashed border-emerald-400 bg-emerald-50 p-6 text-center dark:bg-emerald-950/40 md:p-8">
            <p className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 md:text-2xl text-balance">
              {t('only.conclusion')}
            </p>
          </div>
        </div>
      </section>

      {/* Dos caminos */}
      <section className="bg-muted/60 py-16 md:py-24">
        <div className="container px-4">
          <SectionHeading eyebrow={t('paths.eyebrow')} title={t('paths.title')} />

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              { key: "drain", steps: drainSteps, icons: drainIcons, bad: true },
              { key: "dry", steps: drySteps, icons: dryIcons, bad: false },
            ].map(({ key, steps, icons, bad }) => (
              <div
                key={key}
                className={cn(
                  "rounded-3xl p-6 md:p-8 ring-1",
                  bad
                    ? "bg-slate-100 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-800"
                    : "bg-emerald-50 ring-emerald-200 dark:bg-emerald-950/50 dark:ring-emerald-900"
                )}
              >
                <h3 className={cn("text-2xl font-bold", bad ? "text-slate-700 dark:text-slate-200" : "text-emerald-800 dark:text-emerald-200")}>
                  {t(`paths.${key}.title`)}
                </h3>
                <ol className="mt-6 space-y-2">
                  {steps.map((step, index) => {
                    const Icon = icons[index];
                    return (
                      <li key={step.title}>
                        <div className="flex items-center gap-4 rounded-2xl bg-background/80 p-4 shadow-sm">
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                              bad
                                ? index === steps.length - 1
                                  ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                                  : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                            )}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-semibold">{step.title}</p>
                            <p className="text-sm text-muted-foreground">{step.text}</p>
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <ArrowDown className={cn("mx-auto my-1 h-5 w-5", bad ? "text-slate-400" : "text-emerald-500")} />
                        )}
                      </li>
                    );
                  })}
                </ol>
                <div
                  className={cn(
                    "mt-6 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-center font-bold",
                    bad ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                  )}
                >
                  {bad ? <X className="h-5 w-5" /> : <CircleCheck className="h-5 w-5" />}
                  {t(`paths.${key}.result`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tinacos */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <SectionHeading title={t('water.title')} />
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-5 justify-items-center gap-4 sm:grid-cols-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-in fade-in zoom-in" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}>
                <Tank />
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm font-medium text-muted-foreground">{t('water.unit')}</p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xl font-semibold text-balance">{t('water.caption')}</p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-gradient-to-b from-amber-50/70 to-background py-16 dark:from-amber-950/20 md:py-24">
        <div className="container px-4">
          <SectionHeading eyebrow={t('howItWorks.eyebrow')} title={t('howItWorks.title')} description={t('howItWorks.description')} />

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <div className="rounded-3xl border bg-card p-4 shadow-xl md:p-6">
              <DryToiletDiagram
                labels={{
                  seat: t('howItWorks.diagram.seat'),
                  vent: t('howItWorks.diagram.vent'),
                  chamberActive: t('howItWorks.diagram.chamberActive'),
                  chamberResting: t('howItWorks.diagram.chamberResting'),
                  urine: t('howItWorks.diagram.urine'),
                  compost: t('howItWorks.diagram.compost'),
                }}
              />
            </div>

            <ol className="grid gap-4 sm:grid-cols-2">
              {howSteps.map((step, index) => {
                const Icon = stepIcons[index];
                return (
                  <li key={step.title} className="relative rounded-2xl border bg-card p-5 shadow-sm">
                    <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow">
                      {index + 1}
                    </span>
                    <Icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    <p className="mt-3 font-bold">{step.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-amber-100/80 p-6 dark:bg-amber-900/30">
              <h3 className="flex items-center gap-2 text-lg font-bold text-amber-900 dark:text-amber-200">
                <Layers className="h-5 w-5" /> {t('howItWorks.mix.title')}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {mixItems.map((item) => (
                  <span key={item} className="rounded-full bg-background px-3 py-1.5 text-sm font-medium shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-yellow-100/80 p-6 dark:bg-yellow-900/30">
              <h3 className="flex items-center gap-2 text-lg font-bold text-yellow-900 dark:text-yellow-200">
                <Droplets className="h-5 w-5" /> {t('howItWorks.urine.title')}
              </h3>
              <p className="mt-3 text-sm md:text-base">{t('howItWorks.urine.text')}</p>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">{t('howItWorks.source')}</p>
        </div>
      </section>

      {/* Mitos y realidades */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <SectionHeading eyebrow={t('myths.eyebrow')} title={t('myths.title')} />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {myths.map((item) => (
              <div key={item.myth} className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                <div className="flex items-center gap-3 bg-rose-50 px-6 py-4 dark:bg-rose-950/30">
                  <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold uppercase text-white">{t('myths.mythLabel')}</span>
                  <p className="font-semibold text-rose-900 line-through decoration-2 dark:text-rose-200">&ldquo;{item.myth}&rdquo;</p>
                </div>
                <div className="flex gap-3 px-6 py-5">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <p>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{t('myths.factLabel')}: </span>
                    {item.fact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiencias */}
      <section className="bg-emerald-950 py-16 text-emerald-50 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-emerald-800 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-lime-300">
              {t('stories.eyebrow')}
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">{t('stories.title')}</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stories.map((story) => (
              <a
                key={story.name}
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-3xl bg-emerald-900/60 p-6 ring-1 ring-emerald-800 transition hover:-translate-y-1 hover:bg-emerald-900"
              >
                <span className="w-fit rounded-full bg-lime-300 px-3 py-1 text-sm font-bold text-emerald-950">{story.highlight}</span>
                <h3 className="mt-5 text-xl font-bold">{story.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-emerald-300">
                  <MapPin className="h-4 w-4" /> {story.place}
                </p>
                <p className="mt-4 grow text-emerald-100/90">{story.text}</p>
                <span className="mt-6 inline-flex items-center gap-1 font-semibold text-lime-300 group-hover:underline">
                  {story.linkLabel} <ExternalLink className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Comunidad + recursos */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-lime-700 p-8 text-white shadow-2xl md:p-14">
            <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-lime-300/20 blur-2xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[2fr_1fr]">
              <div>
                <h2 className="text-3xl font-bold text-balance md:text-4xl">{t('community.title')}</h2>
                <p className="mt-4 text-lg text-emerald-50/90">{t('community.description')}</p>
                <p className="mt-2 text-emerald-50/80">{t('hero.platformDescription')}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/signup" className={cn(buttonVariants({ size: "xl" }), "rounded-full bg-white text-emerald-800 hover:bg-emerald-50")}>
                  {t('community.ctaSignUp')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/map" className={cn(buttonVariants({ size: "xl", variant: "outline" }), "rounded-full border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white")}>
                  <MapPin className="mr-2 h-5 w-5" /> {t('community.ctaMap')}
                </Link>
              </div>
            </div>
          </div>

          <h3 className="mt-16 text-center text-2xl font-bold md:text-3xl">{t('resources.title')}</h3>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {resources.map((resource, index) => {
              const Icon = resourceIcons[index];
              return (
                <a
                  key={resource.url + index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition hover:border-emerald-400 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="grow">
                    <p className="font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{resource.title}</p>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Home'
}
