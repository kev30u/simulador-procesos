import type { ProcesoResponse } from "@/types/estado";

type PanelBCPProps = {
  proceso: ProcesoResponse | null;
};

type FilaBCPProps = {
  etiqueta: string;
  valor: string | number;
  claveCambio: string;
  colorTexto?: string;
  puntoColor?: string;
};

function FilaBCP({
  etiqueta,
  valor,
  claveCambio,
  colorTexto = "text-slate-900",
  puntoColor,
}: FilaBCPProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="text-slate-500">{etiqueta}</span>
      <span
        key={claveCambio}
        className={`font-mono tabular-nums animate-value-flash inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-medium ${colorTexto}`}
      >
        {puntoColor && (
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: puntoColor }}
          />
        )}
        {valor}
      </span>
    </div>
  );
}

export default function PanelBCP({ proceso }: PanelBCPProps) {
  const bcp = proceso?.bcp ?? null;

  return (
    <div className="min-h-32 rounded-md border border-slate-200 p-3">
      <h3 className="mb-3 font-medium">Panel BCP</h3>

      {proceso === null && (
        <p className="text-sm text-slate-500">
          No hay un proceso en ejecución
        </p>
      )}

      {proceso !== null && bcp === null && (
        <p className="text-sm text-slate-500">
          El proceso no tiene información BCP
        </p>
      )}

      {proceso !== null && bcp !== null && (
        <div className="divide-y divide-slate-100">
          <FilaBCP
            etiqueta="Proceso"
            valor={proceso.nombre}
            claveCambio={`nombre-${bcp.pid}-${proceso.nombre}`}
            puntoColor={proceso.color}
          />
          <FilaBCP
            etiqueta="PID"
            valor={bcp.pid}
            claveCambio={`pid-${bcp.pid}`}
          />
          <FilaBCP
            etiqueta="Quantum"
            valor={bcp.quantum}
            claveCambio={`quantum-${bcp.pid}-${bcp.quantum}`}
          />
          <FilaBCP
            etiqueta="Prioridad"
            valor={bcp.prioridad}
            claveCambio={`prioridad-${bcp.pid}-${bcp.prioridad}`}
          />
          <FilaBCP
            etiqueta="Interactividad"
            valor={bcp.interactividad}
            claveCambio={`inter-${bcp.pid}-${bcp.interactividad}`}
          />
          <FilaBCP
            etiqueta="Tiempo de CPU"
            valor={bcp.tiempoCpu}
            claveCambio={`cpu-${bcp.pid}-${bcp.tiempoCpu}`}
          />
          <FilaBCP
            etiqueta="Tiempo restante"
            valor={bcp.tiempoRestante}
            claveCambio={`restante-${bcp.pid}-${bcp.tiempoRestante}`}
            colorTexto="text-emerald-700"
          />
        </div>
      )}
    </div>
  );
}
