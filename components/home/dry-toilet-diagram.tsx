type DiagramLabels = {
  seat: string;
  vent: string;
  chamberActive: string;
  chamberResting: string;
  urine: string;
  compost: string;
};

/**
 * Corte transversal ilustrado de un sanitario seco de doble cámara
 * con taza separadora, ventilación y recipiente de orina.
 */
export function DryToiletDiagram({ labels }: { labels: DiagramLabels }) {
  return (
    <svg
      viewBox="0 0 420 330"
      role="img"
      aria-label={`${labels.seat}, ${labels.chamberActive}, ${labels.chamberResting}, ${labels.vent}, ${labels.urine}`}
      className="h-auto w-full text-foreground"
    >
      {/* Cielo y suelo */}
      <rect x="0" y="262" width="420" height="68" className="fill-amber-800/20 dark:fill-amber-700/25" />
      <path d="M0 262 H420" className="stroke-amber-900/40" strokeWidth="2" />

      {/* Caseta */}
      <path d="M70 70 L215 28 L360 70" fill="none" strokeWidth="6" strokeLinejoin="round" className="stroke-emerald-800 dark:stroke-emerald-500" />
      <rect x="85" y="70" width="260" height="120" rx="4" className="fill-card stroke-border" strokeWidth="2" />

      {/* Ventilación */}
      <rect x="318" y="20" width="14" height="230" rx="3" className="fill-slate-300 dark:fill-slate-600" />
      <path d="M311 20 h28" strokeWidth="5" strokeLinecap="round" className="stroke-slate-400 dark:stroke-slate-500" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M325 ${100 - i * 26} l-5 7 M325 ${100 - i * 26} l5 7`}
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-sky-600 dark:stroke-sky-400 animate-float"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}

      {/* Losa */}
      <rect x="70" y="182" width="270" height="14" rx="2" className="fill-stone-400 dark:fill-stone-500" />

      {/* Taza separadora */}
      <path d="M135 182 L141 140 H199 L205 182 Z" className="fill-stone-100 stroke-stone-500 dark:fill-stone-200" strokeWidth="2" />
      <ellipse cx="170" cy="140" rx="33" ry="7" className="fill-stone-200 stroke-stone-500 dark:fill-stone-300" strokeWidth="2" />
      <ellipse cx="160" cy="140" rx="10" ry="3" className="fill-amber-300" />

      {/* Cubeta de mezcla secante */}
      <path d="M232 182 L236 154 H264 L268 182 Z" className="fill-amber-600/80 stroke-amber-800" strokeWidth="1.5" />
      <ellipse cx="250" cy="154" rx="14" ry="3" className="fill-amber-200" />

      {/* Cámaras */}
      <rect x="80" y="196" width="125" height="96" className="fill-stone-300/70 stroke-stone-500 dark:fill-stone-700/70" strokeWidth="2" />
      <rect x="205" y="196" width="125" height="96" className="fill-stone-300/70 stroke-stone-500 dark:fill-stone-700/70" strokeWidth="2" />

      {/* Cámara activa: montículo con capas */}
      <path d="M86 292 Q142 228 199 292 Z" className="fill-amber-700/80" />
      <path d="M100 280 Q142 244 185 280" fill="none" className="stroke-amber-300/80" strokeWidth="3" />
      <path d="M86 292 H199" className="stroke-amber-900" strokeWidth="6" />

      {/* Cámara en reposo: composta y brote */}
      <rect x="211" y="246" width="113" height="46" className="fill-amber-950/80 dark:fill-amber-900" />
      <path d="M268 246 v-14" className="stroke-lime-600" strokeWidth="3" strokeLinecap="round" />
      <path d="M268 236 q-12 -4 -14 -14 q12 2 14 14" className="fill-lime-500" />
      <path d="M268 232 q10 -6 12 -16 q-12 4 -12 16" className="fill-lime-600" />

      {/* Tubo de orina hacia recipiente */}
      <path d="M155 182 V204 Q155 214 145 214 H40 V236" fill="none" strokeWidth="4" strokeLinecap="round" className="stroke-yellow-500" />
      <rect x="22" y="236" width="36" height="44" rx="6" className="fill-yellow-200/80 stroke-yellow-600" strokeWidth="2" />
      <rect x="25" y="256" width="30" height="21" rx="3" className="fill-yellow-400/80" />
      <circle cx="40" cy="226" r="2.5" className="fill-yellow-500 animate-drip" />

      {/* Etiquetas */}
      <g className="fill-current text-[11px] font-semibold" style={{ fontFamily: "inherit" }}>
        <text x="170" y="120" textAnchor="middle">{labels.seat}</text>
        <text x="342" y="60" textAnchor="start">{labels.vent}</text>
        <text x="142" y="314" textAnchor="middle">{labels.chamberActive}</text>
        <text x="268" y="314" textAnchor="middle">{labels.chamberResting}</text>
        <text x="40" y="298" textAnchor="middle">{labels.urine}</text>
        <text x="268" y="270" textAnchor="middle" className="fill-amber-100 text-[10px]">{labels.compost}</text>
      </g>
    </svg>
  );
}
