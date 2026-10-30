import { simulador } from "@/core/simulacion/instancia";

export async function POST() {
  simulador.reiniciar();
  return Response.json(simulador.obtenerEstado());
}