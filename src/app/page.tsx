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
  const estadoActual = useRef<EstadoSimulador | null>(null);
  const intervaloSimulacion = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const cambioVisual = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============ Acciones de la simulación ============
  async function avanzarSimulacion() {
    try {
      const nuevoEstado = await avanzarUnTick();

      const procesoAnterior = estadoActual.current?.enEjecucion;
      const procesoSiguiente = nuevoEstado.enEjecucion;
      const bcpAnterior = procesoAnterior?.bcp;
      const procesoCambio =
        procesoAnterior !== null &&
        procesoAnterior !== undefined &&
        bcpAnterior !== null &&
        bcpAnterior !== undefined &&
        (procesoSiguiente === null ||
          procesoSiguiente.bcp?.pid !== bcpAnterior.pid);

      if (
        procesoCambio &&
        bcpAnterior !== null &&
        bcpAnterior !== undefined
      ) {
        const procesoActualizado = buscarProceso(nuevoEstado, bcpAnterior.pid);
        const procesoParaMostrar =
          procesoActualizado ?? crearProcesoTerminado(procesoAnterior);

        setEstado({
          ...nuevoEstado,
          enEjecucion: {
            ...procesoParaMostrar,
            estado: "ejecucion",
          },
        });

        if (cambioVisual.current !== null) {
          clearTimeout(cambioVisual.current);
        }

        cambioVisual.current = setTimeout(() => {
          setEstado(nuevoEstado);
          cambioVisual.current = null;
        }, 400);
      } else {
        setEstado(nuevoEstado);
      }

      setMensajeError("");
      setUltimaAccion("Avanzar");
    } catch (error) {
      mostrarError(error);
    }
  }

  function buscarProceso(
    estadoActual: EstadoSimulador,
    pid: number,
  ): ProcesoResponse | null {
    const procesos = [
      ...estadoActual.programas,
      ...estadoActual.preparados,
    ];
    const procesoEncontrado = procesos.find(
      (proceso) => proceso.bcp?.pid === pid,
    );

    return procesoEncontrado ?? null;
  }

  function crearProcesoTerminado(
    proceso: ProcesoResponse,
  ): ProcesoResponse {
    if (proceso.bcp === null) {
      return proceso;
    }

    return {
      ...proceso,
      bcp: {
        ...proceso.bcp,
        tiempoRestante: 0,
      },
    };
  }

  function pausarSimulacion() {
    if (intervaloSimulacion.current !== null) {
      clearInterval(intervaloSimulacion.current);
      intervaloSimulacion.current = null;
    }

    setUltimaAccion("Pausar");
  }

  function reproducirSimulacion() {
    if (intervaloSimulacion.current !== null) {
      return;
    }

    intervaloSimulacion.current = setInterval(() => {
      avanzarSimulacion();
    }, 1000);

    setUltimaAccion("Reproducir");
  }

  async function detenerSimulacion() {
    pausarSimulacion();

    try {
      if (cambioVisual.current !== null) {
        clearTimeout(cambioVisual.current);
        cambioVisual.current = null;
      }

      const estadoInicial = await reiniciarSimulacion();
      setEstado(estadoInicial);
      setMensajeError("");
      setUltimaAccion("Detener");
    } catch (error) {
      mostrarError(error);
    }
  }

  async function iniciarProgramaSeleccionado(nombre: string) {
    try {
      if (cambioVisual.current !== null) {
        clearTimeout(cambioVisual.current);
        cambioVisual.current = null;
      }

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
    estadoActual.current = estado;
  }, [estado]);

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
      if (cambioVisual.current !== null) {
        clearTimeout(cambioVisual.current);
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