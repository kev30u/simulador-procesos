import { simulador, planificador } from "@/core/simulacion/instancia";

export async function POST() {
  planificador.tick();
  return Response.json(simulador.obtenerEstado());
}