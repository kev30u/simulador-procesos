import { simulador } from "@/core/simulacion/instancia";

// Evita que Next guarde la respuesta en caché.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(simulador.obtenerEstado());
}