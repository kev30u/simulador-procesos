import { simulador } from "@/core/simulacion/instancia";

export async function POST(request: Request) {
  // El frontend manda el nombre del programa en el cuerpo de la petición.
  const { nombre } = await request.json();

  const existe = simulador.iniciarPorNombre(nombre);
  if (!existe) {
    return Response.json({ error: "Programa no encontrado" }, { status: 404 });
  }

  return Response.json(simulador.obtenerEstado());
}