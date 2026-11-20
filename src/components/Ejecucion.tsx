import type { ProcesoResponse } from "@/types/estado";
import BolitaProceso from "./BolitaProceso";

type EjecucionProps = {
  proceso: ProcesoResponse | null;
  turnoGastado: number;
};

function calcularProgresoQuantum(
  proceso: ProcesoResponse | null,
  turnoGastado: number,
): number {
  if (proceso === null || proceso.bcp === null) {
    return 0;
  }

  // Sumamos 1 para que la barra empiece en 25% y llegue al 100%
  const progreso = ((turnoGastado + 1) / proceso.bcp.quantum) * 100;

  return Math.min(100, Math.round(progreso));
}


// ==========================  Componente Ejecución  ==========================
export default function Ejecucion({ proceso, turnoGastado }: EjecucionProps) {
  const progreso = calcularProgresoQuantum(proceso, turnoGastado);

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">Ejecución</h3>
      </div>

      <div className="mb-4 flex justify-center">
        {proceso !== null && (
          <BolitaProceso proceso={proceso} mostrarProgresoCpu />
        )}
        {proceso === null && (
          <p className="text-sm text-slate-500">
            No hay un proceso en ejecución
          </p>
        )}
      </div>

      <div className="h-5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          key={proceso?.bcp?.pid ?? "sin-proceso"}
          className="h-5 rounded-full transition-[width] duration-300 ease-out"
          style={{
            width: `${progreso}%`,
            backgroundColor: proceso === null ? "#CBD5E1" : proceso.color,
          }}
        />
      </div>

      <p className="tabular-nums mt-2 text-right text-xs text-slate-500">
        {progreso}% del quantum
      </p>
    </div>
  );
}
