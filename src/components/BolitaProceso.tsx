import type { ProcesoResponse } from "@/types/estado";

type BolitaProcesoProps = {
  proceso: ProcesoResponse;
  onClick?: () => void;
  mostrarProgresoCpu?: boolean;
};

export default function BolitaProceso({
  proceso,
  onClick,
  mostrarProgresoCpu = false,
}: BolitaProcesoProps) {
  let porcentajeTiempoRestante = 0;

  if (proceso.bcp !== null && proceso.bcp.tiempoCpu > 0) {
    // Restamos 1 para adelantar el tick visual, igual que en la barra de ejecución
    const tiempoRestanteVisual = proceso.bcp.tiempoRestante;

    porcentajeTiempoRestante = Math.max(
      0,
      (tiempoRestanteVisual / proceso.bcp.tiempoCpu) * 100,
    );
  }

  return (
    <div className="group relative flex h-24 w-24 items-center justify-center">
      {mostrarProgresoCpu && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 96 96"
          aria-hidden="true"
        >
          <circle cx="48" cy="48" r="45" fill="none" stroke="#CBD5E1" strokeWidth="4" />
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
            className="transition-[stroke-dashoffset] duration-300 ease-in-out"
          />
        </svg>
      )}

      <button
        type="button"
        onClick={onClick}
        style={{ backgroundColor: proceso.color }}
        className="flex h-20 w-20 items-center justify-center rounded-full text-center text-xs font-bold text-white hover:opacity-80"
      >
        {proceso.nombre}
      </button>

      <div className="absolute left-1/2 top-full z-10 mt-2 hidden w-50 -translate-x-1/2 rounded-md bg-slate-800 p-3 text-xs text-white shadow-lg group-hover:block">
        <p>Nombre: {proceso.nombre}</p>
        <p>Estado: {proceso.estado}</p>

        {proceso.bcp === null && <p>No tiene BCP</p>}

        {proceso.bcp !== null && (
          <div>
            <p>PID: {proceso.bcp.pid}</p>
            <p>Quantum: {proceso.bcp.quantum}</p>
            <p>Prioridad: {proceso.bcp.prioridad}</p>
            <p>Interactividad: {proceso.bcp.interactividad}</p>
            <p>Tiempo de CPU: {proceso.bcp.tiempoCpu}</p>
            <p>Tiempo restante: {proceso.bcp.tiempoRestante}</p>
          </div>
        )}
      </div>
    </div>
  );
}