"use client";

import { useState, useEffect, useRef } from "react";

import Controles from "@/components/Controles";
import Ejecucion from "@/components/Ejecucion";
import PanelBCP from "@/components/PanelBCP";
import Preparados from "@/components/Preparados";
import Programas from "@/components/Programas";
import {
  avanzarUnTick,
  iniciarPrograma,
  obtenerEstado,
  reiniciarSimulacion,
} from "@/services/simulador";
import type { EstadoSimulador, ProcesoResponse } from "@/types/estado";

export default function Home() {
  // ============ Estado de la página ============
  const [estado, setEstado] = useState<EstadoSimulador | null>(null);
  const [ultimaAccion, setUltimaAccion] = useState("Ninguna");
  const [mensajeError, setMensajeError] = useState("");
  const intervaloSimulacion = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

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

  // ============ Pausar Simulacion ============
  function pausarSimulacion() {
    if (intervaloSimulacion.current !== null) {
      clearInterval(intervaloSimulacion.current);
      intervaloSimulacion.current = null;
    }

    setUltimaAccion("Pausar");
  }

  // ============ Reproducion Simulacion ============
  function reproducirSimulacion() {
    if (intervaloSimulacion.current !== null) {
      return;
    }

    intervaloSimulacion.current = setInterval(() => {
      avanzarSimulacion();
    }, 2000);

    setUltimaAccion("Reproducir");
  }

  // ============ Detener de la simulación ============
  async function detenerSimulacion() {
    pausarSimulacion();

    try {
      const estadoInicial = await reiniciarSimulacion();
      setEstado(estadoInicial);
      setMensajeError("");
      setUltimaAccion("Detener");
    } catch (error) {
      mostrarError(error);
    }
  }

  // ============Iniciar programa ============
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

  useEffect(() => {
    return () => {
      if (intervaloSimulacion.current !== null) {
        clearInterval(intervaloSimulacion.current);
      }
    };
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
            <h2 className="mb-4 text-lg font-semibold">Programas</h2>
            <Programas
              programas={programas}
              onProgramaClick={iniciarProgramaSeleccionado}
            />
          </section>

          <section className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
            <Preparados procesos={procesosPreparados} />
            <Ejecucion proceso={procesoEnEjecucion} />
          </section>

          <section className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
            <Controles
              onDetener={detenerSimulacion}
              onPausar={pausarSimulacion}
              onReproducir={reproducirSimulacion}
              onAvanzar={avanzarSimulacion}
            />
            <p className="text-sm text-slate-500">
              Última acción: {ultimaAccion}
            </p>
            {mensajeError !== "" && (
              <p className="text-sm text-red-600">{mensajeError}</p>
            )}
            <PanelBCP proceso={procesoEnEjecucion} />
          </section>
        </div>
      </div>
    </main>
  );
}