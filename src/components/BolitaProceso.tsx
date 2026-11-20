import type { ProcesoResponse } from "@/types/estado";

type BolitaProcesoProps = {
  proceso: ProcesoResponse;
  onClick?: () => void;
  variante?: "bolita" | "tarjeta";
  mostrarProgresoCpu?: boolean;
  indiceCola?: number;
};

const ETIQUETA_ESTADO: Record<ProcesoResponse["estado"], string> = {
  inactivo: "Inactivo",
  preparado: "Preparado",
  ejecucion: "En ejecución",
  suspendido: "Suspendido",
};

export default function BolitaProceso({
  proceso,
  onClick,
  variante = "bolita",
  mostrarProgresoCpu = false,
  indiceCola,
}: BolitaProcesoProps) {
  const bcp = proceso.bcp;

  let porcentajeTiempoRestante = 0;
  if (bcp !== null && bcp.tiempoCpu > 0) {
    porcentajeTiempoRestante = Math.max(
      0,
      Math.min(100, (bcp.tiempoRestante / bcp.tiempoCpu) * 100),
    );
  }

  const tooltip = (
    <div
      role="tooltip"
      className="animate-tooltip-in pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-56 -translate-x-1/2 rounded-md border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 shadow-lg group-hover:block"
    >
      <div className="mb-2 flex items-center justify-between border-b border-slate-700/80 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: proceso.color }}
          />
          <span className="font-semibold text-white">{proceso.nombre}</span>
        </div>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
          {ETIQUETA_ESTADO[proceso.estado]}
        </span>
      </div>

      {bcp === null ? (
        <p className="text-slate-400">No tiene BCP</p>
      ) : (
        <div className="divide-y divide-slate-800 text-[11px]">
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">PID</span>
            <span className="font-mono tabular-nums font-medium text-white">
              {bcp.pid}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Quantum</span>
            <span className="font-mono tabular-nums font-medium text-white">
              {bcp.quantum}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Prioridad</span>
            <span className="font-mono tabular-nums font-medium text-white">
              {bcp.prioridad}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Interactividad</span>
            <span className="font-mono tabular-nums font-medium text-white">
              {bcp.interactividad}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Tiempo de CPU</span>
            <span className="font-mono tabular-nums font-medium text-white">
              {bcp.tiempoCpu}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400">Tiempo restante</span>
            <span className="font-mono tabular-nums font-semibold text-emerald-400">
              {bcp.tiempoRestante}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Variante tarjeta (solo para Programas)
  if (variante === "tarjeta") {
    return (
      <div
        data-proceso-id={proceso.nombre}
        className="group relative w-full"
      >
        <button
          type="button"
          onClick={onClick}
          className="relative flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-md border border-slate-200 bg-white px-3 py-2.5 text-left shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 active:translate-y-0 active:scale-[0.99]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1"
            style={{ backgroundColor: proceso.color }}
          />

          <div className="flex min-w-0 items-center gap-2.5 pl-1">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: proceso.color }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-semibold text-slate-900">
                  {proceso.nombre}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Listo para cargar
              </p>
            </div>
          </div>
        </button>

        {tooltip}
      </div>
    );
  }

  // Variante bolita (Preparados, Ejecución y Suspendidos, igual que main + número de posición encima)
  return (
    <div
      data-proceso-id={proceso.nombre}
      className="group relative flex h-24 w-24 items-center justify-center"
    >
      {mostrarProgresoCpu && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 96 96"
          aria-hidden="true"
        >
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="4"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke={proceso.color}
            strokeWidth="4"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - porcentajeTiempoRestante}
            className="transition-[stroke-dashoffset] duration-300 ease-out"
          />
        </svg>
      )}

      <button
        type="button"
        onClick={onClick}
        style={{ backgroundColor: proceso.color }}
        className="flex h-20 w-20 flex-col items-center justify-center rounded-full text-center text-xs font-bold text-white transition-all duration-150 hover:scale-105 hover:opacity-90 active:scale-95"
      >
        {indiceCola !== undefined && (
          <span className="font-mono tabular-nums mb-0.5 text-[10px] font-semibold leading-none opacity-85">
            #{indiceCola}
          </span>
        )}
        <span className="leading-tight">{proceso.nombre}</span>
      </button>

      {tooltip}
    </div>
  );
}
