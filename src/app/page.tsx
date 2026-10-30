"use client";

import { useState } from "react";

import Controles from "@/components/Controles";
import Ejecucion from "@/components/Ejecucion";
import PanelBCP from "@/components/PanelBCP";
import Preparados from "@/components/Preparados";
import Programas from "@/components/Programas";

const programas = ["Editor de texto", "Navegador", "Calculadora"];
const procesosPreparados = ["Proceso 2", "Proceso 3"];
const procesoEnEjecucion = "Proceso 1";

export default function Home() {
  const [ultimaAccion, setUltimaAccion] = useState("Ninguna");

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Simulador de procesos
        </h1>

        <div className="grid gap-4 lg:grid-cols-3">
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Panel 1</h2>
            <Programas programas={programas} />
          </section>

          <section className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Panel 2</h2>
            <Preparados procesos={procesosPreparados} />
            <Ejecucion proceso={procesoEnEjecucion} progreso={66} />
          </section>

          <section className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Panel 3</h2>
            <Controles
              onRetroceder={() => setUltimaAccion("Retroceder")}
              onDetener={() => setUltimaAccion("Detener")}
              onPausar={() => setUltimaAccion("Pausar")}
              onReproducir={() => setUltimaAccion("Reproducir")}
              onAvanzar={() => setUltimaAccion("Avanzar")}
            />
            <p className="text-sm text-slate-500">
              Última acción: {ultimaAccion}
            </p>
            <PanelBCP />
          </section>
        </div>
      </div>
    </main>
  );
}