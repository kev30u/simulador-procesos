"use client";

import { useState } from "react";
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
  const [mostrarInformacion, setMostrarInformacion] = useState(false);
  let porcentajeTiempoRestante = 0;

  if (
    mostrarProgresoCpu &&
    proceso.bcp !== null &&
    proceso.bcp.tiempoCpu > 0
  ) {
    porcentajeTiempoRestante =
      (proceso.bcp.tiempoRestante / proceso.bcp.tiempoCpu) * 100;
  }

  porcentajeTiempoRestante = Math.max(
    0,
    Math.min(100, porcentajeTiempoRestante),
  );

  function mostrarPanel() {
    setMostrarInformacion(true);
  }

  function ocultarPanel() {
    setMostrarInformacion(false);
  }

  return (
    <div
      className="relative flex h-24 w-24 items-center justify-center"
      onMouseEnter={mostrarPanel}
      onMouseLeave={ocultarPanel}
    >
      {mostrarProgresoCpu && (
        <div
          className="relative flex h-24 w-24 items-center justify-center"
        >
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
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={
                2 * Math.PI * 45 * (1 - porcentajeTiempoRestante / 100)
              }
              style={{
                transition: "stroke-dashoffset 300ms ease-in-out",
              }}
            />
          </svg>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <button
              type="button"
              onClick={onClick}
              style={{ backgroundColor: proceso.color }}
              className="flex h-20 w-20 items-center justify-center rounded-full text-center text-xs font-bold text-white hover:opacity-80"
            >
              {proceso.nombre}
            </button>
          </div>
        </div>
      )}

      {!mostrarProgresoCpu && (
        <button
          type="button"
          onClick={onClick}
          style={{ backgroundColor: proceso.color }}
          className="flex h-20 w-20 items-center justify-center rounded-full text-center text-xs font-bold text-white hover:opacity-80"
        >
          {proceso.nombre}
        </button>
      )}

      {mostrarInformacion && (
        <div className="absolute left-1/2 top-full z-10 mt-2 w-50 -translate-x-1/2 rounded-md bg-slate-800 p-3 text-xs text-white shadow-lg">
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
              {/* <p>
                Tiempo de interactividad restante:{" "}
                {proceso.bcp.tiempoInteractividadRestante}
              </p> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}