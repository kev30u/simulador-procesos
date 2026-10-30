"use client";

import { useState, useEffect } from "react";

import Controles from "@/components/Controles";
import Ejecucion from "@/components/Ejecucion";
import PanelBCP from "@/components/PanelBCP";
import Preparados from "@/components/Preparados";
import Programas from "@/components/Programas";
import {
  avanzarUnTick,
  iniciarPrograma,
  obtenerEstado,
} from "@/services/simulador";
import type { EstadoSimulador, ProcesoResponse } from "@/types/estado";

export default function Home() {
  // ============ Estado de la página ============
  const [estado, setEstado] = useState<EstadoSimulador | null>(null);
  const [ultimaAccion, setUltimaAccion] = useState("Ninguna");
  const [mensajeError, setMensajeError] = useState("");

  // ============ Acciones de la simulación ============
  async function avanzarSimulacion() {
    try {
      const nuevoEstado = await avanzarUnTick();
      setEstado(nuevoEstado);
      setMensajeError("");
      setUltimaAccion("Avanzar");
    } catch (error) {
      mostrarError(error);
    }
  }

  async function iniciarProgramaSeleccionado(nombre: string) {
    try {
      const nuevoEstado = await iniciarPrograma(nombre);
      setEstado(nuevoEstado);
      setMensajeError("");
      setUltimaAccion("Iniciar programa");
    } catch (error) {
      mostrarError(error);
    }
  }

  // ============ Mostrar errores ============
  function mostrarError(error: unknown) {
    if (error instanceof Error) {
      setMensajeError(error.message);
    } else {
      setMensajeError("Ocurrió un error inesperado");
    }
  }

  // ============ Cargar el estado inicial ============
  useEffect(() => {
    obtenerEstado()
      .then((estadoInicial) => {
        setEstado(estadoInicial);
      })
      .catch((error: unknown) => {
        mostrarError(error);
      });
  }, []);

  // ============ Preparar los datos para mostrar ============
  let programas: ProcesoResponse[] = [];
  let procesosPreparados: ProcesoResponse[] = [];
  let procesoEnEjecucion: ProcesoResponse | null = null;

  if (estado !== null) {
    programas = estado.programas;
    procesosPreparados = estado.preparados;
    procesoEnEjecucion = estado.enEjecucion;
  }

  // ============ Mostrar la página ============
  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Simulador de procesos
        </h1>

        <div className="grid gap-4 lg:grid-cols-3">
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Panel 1</h2>
            <Programas
              programas={programas}
              onProgramaClick={iniciarProgramaSeleccionado}
            />
          </section>

          <section className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Panel 2</h2>
            <Preparados procesos={procesosPreparados} />
            <Ejecucion proceso={procesoEnEjecucion} />
          </section>

          <section className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Panel 3</h2>
            <Controles
              onRetroceder={() => setUltimaAccion("Retroceder")}
              onDetener={() => setUltimaAccion("Detener")}
              onPausar={() => setUltimaAccion("Pausar")}
              onReproducir={() => setUltimaAccion("Reproducir")}
              onAvanzar={avanzarSimulacion}
            />
            <p className="text-sm text-slate-500">
              Última acción: {ultimaAccion}
            </p>
            {mensajeError !== "" && (
              <p className="text-sm text-red-600">{mensajeError}</p>
            )}
            <PanelBCP />
          </section>
        </div>
      </div>
    </main>
  );
}