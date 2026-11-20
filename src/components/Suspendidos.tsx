import type { ProcesoResponse } from "@/types/estado";
import BolitaProceso from "./BolitaProceso";

type SuspendidosProps = {
  procesos: ProcesoResponse[];
};

export default function Suspendidos({ procesos }: SuspendidosProps) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <h3 className="mb-3 font-medium">Suspendidos</h3>
      {procesos.length === 0 && (
        <p className="text-sm text-slate-500">No hay procesos suspendidos</p>
      )}
      {procesos.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {procesos.map((proceso) => (
            <div
              key={proceso.nombre}
              className="flex flex-col items-center gap-2"
            >
              <BolitaProceso proceso={proceso} mostrarProgresoCpu />
              {proceso.bcp !== null && (
                <span
                  className="tabular-nums text-xs font-medium"
                  style={{ color: proceso.color }}
                >
                  Ticks restantes: {proceso.bcp.tiempoInteractividadRestante}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
