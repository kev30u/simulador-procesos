"use client";

import { useState } from "react";
import type { ProcesoResponse } from "@/types/estado";

type BolitaProcesoProps = {
  proceso: ProcesoResponse;
  onClick?: () => void;
};

export default function BolitaProceso({
  proceso,
  onClick,
}: BolitaProcesoProps) {
  const [mostrarInformacion, setMostrarInformacion] = useState(false);

  function mostrarPanel() {
    setMostrarInformacion(true);
  }

  function ocultarPanel() {
    setMostrarInformacion(false);
  }

  return (
    <div
      className="relative"
      onMouseEnter={mostrarPanel}
      onMouseLeave={ocultarPanel}
    >
      <button
        type="button"
        onClick={onClick}
        style={{ backgroundColor: proceso.color }}
        className="flex h-20 w-20 items-center justify-center rounded-full text-center text-xs font-bold text-white hover:opacity-80"
      >
        {proceso.nombre}
      </button>

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
              <p>Tiempo de CPU: {proceso.bcp.tiempoCpu}</p>
              <p>Tiempo restante: {proceso.bcp.tiempoRestante}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}