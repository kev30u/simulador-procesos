import type { EstadoSimulador } from "@/types/estado";

// ============ Obtener el estado actual del simulador ============
export async function obtenerEstado(): Promise<EstadoSimulador> {
  const respuesta = await fetch("/api/simulador/estado");

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el estado del simulador");
  }

  const datos: EstadoSimulador = await respuesta.json();
  return datos;
}

// ============ Avanzar la simulación un tick ============
export async function avanzarUnTick(): Promise<EstadoSimulador> {
  const respuesta = await fetch("/api/simulador/tick", {
    method: "POST",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo avanzar la simulación");
  }

  const datos: EstadoSimulador = await respuesta.json();
  return datos;
}

// ============ Reiniciar la simulación ============
export async function reiniciarSimulacion(): Promise<EstadoSimulador> {
  const respuesta = await fetch("/api/simulador/reiniciar", {
    method: "POST",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo detener la simulación");
  }

  const datos: EstadoSimulador = await respuesta.json();
  return datos;
}

// ============ Iniciar un programa por su nombre ============
export async function iniciarPrograma(
  nombre: string,
): Promise<EstadoSimulador> {
  const respuesta = await fetch("/api/simulador/iniciar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre: nombre }),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo iniciar el programa");
  }

  const datos: EstadoSimulador = await respuesta.json();
  return datos;
}
