import { Simulador } from "./Simulador";
import { Planificador } from "./Planificador";

// Guardo las copias en globalThis para que Next no las recree en cada recarga.
const global = globalThis as unknown as {
  simulador?: Simulador;
  planificador?: Planificador;
};

if (!global.simulador || !global.planificador) {
  global.simulador = new Simulador([
    { nombre: "P1", color: "#3B82F6" },
    { nombre: "P2", color: "#22C55E" },
    { nombre: "P3", color: "#A855F7" },
    { nombre: "P4", color: "#F97316" },
    { nombre: "P5", color: "#EF4444" },
  ]);
  global.planificador = new Planificador(global.simulador);
}

export const simulador = global.simulador;
export const planificador = global.planificador;