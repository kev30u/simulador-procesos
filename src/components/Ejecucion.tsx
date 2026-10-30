import BolitaProceso from "./BolitaProceso";

type EjecucionProps = {
  proceso: string;
  progreso: number;
};

export default function Ejecucion({ proceso, progreso }: EjecucionProps) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">Ejecución</h3>
      </div>
      <div className="mb-4 flex justify-center">
        <BolitaProceso nombre={proceso} />
      </div>
      <div className="h-3 w-full rounded-full bg-slate-200">
        <div
          className="h-3 rounded-full bg-blue-500"
          style={{ width: `${progreso}%` }}
        />
      </div>
      <p className="mt-2 text-right text-xs text-slate-500">
        {progreso}% completado
      </p>
    </div>
  );
}