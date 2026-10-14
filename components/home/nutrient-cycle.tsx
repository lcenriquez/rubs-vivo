import { Sprout, Wheat, Users, Toilet, Recycle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CycleLabels = {
  center: string;
  soil: string;
  food: string;
  people: string;
  toilet: string;
  compost: string;
};

const nodes: { key: keyof Omit<CycleLabels, "center">; icon: LucideIcon; color: string }[] = [
  { key: "soil", icon: Sprout, color: "bg-lime-100 text-lime-700 dark:bg-lime-900/60 dark:text-lime-300" },
  { key: "food", icon: Wheat, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300" },
  { key: "people", icon: Users, color: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300" },
  { key: "toilet", icon: Toilet, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300" },
  { key: "compost", icon: Recycle, color: "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300" },
];

export function NutrientCycle({ labels, className }: { labels: CycleLabels; className?: string }) {
  const radius = 38;

  return (
    <div className={cn("relative aspect-square w-full max-w-md mx-auto", className)}>
      {/* Anillo con flechas que giran lentamente */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="46" className="fill-emerald-500/5" />
        <g className="animate-spin-slow">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="0.8"
            strokeDasharray="2 2.5"
            className="stroke-emerald-600/60 dark:stroke-emerald-400/60"
          />
          {[0, 72, 144, 216, 288].map((angle) => (
            <path
              key={angle}
              d="M 0 -2.2 L 2.6 0 L 0 2.2 Z"
              className="fill-emerald-600 dark:fill-emerald-400"
              transform={`rotate(${angle + 36} 50 50) translate(50 ${50 - radius}) `}
            />
          ))}
        </g>
      </svg>

      {/* Centro */}
      <div className="absolute inset-[30%] flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-lime-600 text-white shadow-xl shadow-emerald-900/20">
        <Recycle className="h-8 w-8 sm:h-10 sm:w-10" />
        <span className="mt-1 text-center text-xs font-semibold leading-tight sm:text-sm px-2">
          {labels.center}
        </span>
      </div>

      {/* Nodos del ciclo */}
      {nodes.map(({ key, icon: Icon, color }, index) => {
        const angle = (-90 + index * 72) * (Math.PI / 180);
        const left = 50 + radius * Math.cos(angle);
        const top = 50 + radius * Math.sin(angle);
        return (
          <div
            key={key}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <div
              className={cn(
                "flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl shadow-lg ring-4 ring-background",
                color,
                key === "toilet" && "ring-emerald-400/60 scale-110"
              )}
            >
              <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <span className="mt-1.5 whitespace-nowrap rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold shadow-sm sm:text-sm">
              {labels[key]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
