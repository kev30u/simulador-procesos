import { useEffect, useRef, useState } from "react";
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

  const progreso = Math.round(
    (turnoGastado / proceso.bcp.quantum) * 100,
  );

  return Math.min(100, progreso);
}

export default function Ejecucion({
  proceso,
  turnoGastado,
}: EjecucionProps) {
  const [barraDeProgreso, setBarraDeProgreso] = useState({
    proceso,
    progreso: 0,
  });
  const procesoMostrado = useRef<ProcesoResponse | null>(proceso);

  useEffect(() => {
    const identificadorDelProcesoActual = proceso?.bcp?.pid ?? null;
    const identificadorDelProcesoMostrado =
      procesoMostrado.current?.bcp?.pid ?? null;

    if (
      identificadorDelProcesoActual !== identificadorDelProcesoMostrado
    ) {
      const completarBarra = setTimeout(() => {
        setBarraDeProgreso((barraAnterior) => ({
          proceso: barraAnterior.proceso,
          progreso: 100,
        }));
      }, 0);

      const mostrarNuevoProceso = setTimeout(() => {
        procesoMostrado.current = proceso;
        setBarraDeProgreso({
          proceso,
          progreso: 0,
        });
      }, 300);

      return () => {
        clearTimeout(completarBarra);
        clearTimeout(mostrarNuevoProceso);
      };
    }

    const nuevoProgreso = calcularProgresoQuantum(proceso, turnoGastado);

    const actualizarBarra = setTimeout(() => {
      setBarraDeProgreso({
        proceso,
        progreso: nuevoProgreso,
      });
    }, 0);

    return () => clearTimeout(actualizarBarra);
  }, [proceso, turnoGastado]);

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">Ejecución</h3>
      </div>
      <div className="mb-4 flex justify-center">
        {barraDeProgreso.proceso !== null && (
          <BolitaProceso
            proceso={barraDeProgreso.proceso}
            mostrarProgresoCpu
          />
        )}
        {barraDeProgreso.proceso === null && (
          <p className="text-sm text-slate-500">
            No hay un proceso en ejecución
          </p>
        )}
      </div>
      <div className="h-5 w-full rounded-full bg-slate-200">
        <div
          key={barraDeProgreso.proceso?.bcp?.pid ?? "sin-proceso"}
          className="h-5 rounded-full transition-[width] duration-300 ease-in-out"
          style={{
            width: `${barraDeProgreso.progreso}%`,
            backgroundColor:
              barraDeProgreso.proceso === null
                ? "#CBD5E1"
                : barraDeProgreso.proceso.color,
          }}
        />
      </div>
      <p className="mt-2 text-right text-xs text-slate-500">
        {barraDeProgreso.progreso}% del quantum
      </p>
    </div>
  );
}