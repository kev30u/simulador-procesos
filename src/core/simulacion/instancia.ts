import { Simulador } from "./Simulador";
import { Planificador } from "./Planificador";

// Guardo las copias en globalThis para que Next no las recree en cada recarga.
const global = globalThis as unknown as {
  simulador?: Simulador;
  planificador?: Planificador;
};

if (!global.simulador || !global.planificador) {
  global.simulador = new Simulador(["P1", "P2", "P3", "P4", "P5"]);
  global.planificador = new Planificador(global.simulador);
}

export const simulador = global.simulador;
export const planificador = global.planificador;