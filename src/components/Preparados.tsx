import type { ProcesoResponse } from "@/types/estado";
import BolitaProceso from "./BolitaProceso";

type PreparadosProps = {
  procesos: ProcesoResponse[];
};

export default function Preparados({ procesos }: PreparadosProps) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <h3 className="mb-3 font-medium">Procesos preparados</h3>
      <div className="flex flex-wrap gap-4">
        {procesos.map((proceso) => (
          <div key={proceso.nombre} className="flex flex-col items-center gap-2">
            <BolitaProceso nombre={proceso.nombre} />
          </div>
        ))}
      </div>
    </div>
  );
}