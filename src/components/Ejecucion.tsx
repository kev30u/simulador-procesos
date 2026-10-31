import type { ProcesoResponse } from "@/types/estado";
import BolitaProceso from "./BolitaProceso";

type EjecucionProps = {
  proceso: ProcesoResponse | null;
};

export default function Ejecucion({ proceso }: EjecucionProps) {
  let progreso = 0;

  if (proceso !== null && proceso.bcp !== null) {
    const tiempoEjecutado =
      proceso.bcp.tiempoCpu - proceso.bcp.tiempoRestante;

    progreso = Math.round(
      (tiempoEjecutado / proceso.bcp.tiempoCpu) * 100,
    );
  }

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">Ejecución</h3>
      </div>
      <div className="mb-4 flex justify-center">
        {proceso !== null && <BolitaProceso proceso={proceso} />}
        {proceso === null && (
          <p className="text-sm text-slate-500">
            No hay un proceso en ejecución
          </p>
        )}
      </div>
      <div className="h-5 w-full rounded-full bg-slate-200">
        <div
          className="h-5 rounded-full transition-[width] duration-300 ease-in-out"
          style={{
            width: `${progreso}%`,
            backgroundColor: proceso === null ? "#CBD5E1" : proceso.color,
          }}
        />
      </div>
      <p className="mt-2 text-right text-xs text-slate-500">
        {progreso}% completado
      </p>
    </div>
  );
}