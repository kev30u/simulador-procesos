import type { ProcesoResponse } from "@/types/estado";

type PanelBCPProps = {
  proceso: ProcesoResponse | null;
};

export default function PanelBCP({ proceso }: PanelBCPProps) {
  return (
    <div className="min-h-32 rounded-md border border-slate-200 p-3">
      <h3 className="mb-3 font-medium">Panel BCP</h3>
      {proceso === null && (
        <p className="text-sm text-slate-500">
          No hay un proceso en ejecución
        </p>
      )}
      {proceso !== null && proceso.bcp === null && (
        <p className="text-sm text-slate-500">
          El proceso no tiene información BCP
        </p>
      )}
      {proceso !== null && proceso.bcp !== null && (
        <div className="grid gap-1 text-sm">
          <p>Proceso: {proceso.nombre}</p>
          <p>PID: {proceso.bcp.pid}</p>
          <p>Quantum: {proceso.bcp.quantum}</p>
          <p>Prioridad: {proceso.bcp.prioridad}</p>
          <p>Interactividad: {proceso.bcp.interactividad}</p>
          <p>Tiempo de CPU: {proceso.bcp.tiempoCpu}</p>
          <p>Tiempo restante: {proceso.bcp.tiempoRestante}</p>
        </div>
      )}
    </div>
  );
}