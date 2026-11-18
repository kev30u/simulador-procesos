import { Simulador } from "./Simulador";
import { Proceso } from "../modelos/Proceso";

export class Planificador {
  // Guardo el simulador para poder leer y modificar sus zonas.
  constructor(private simulador: Simulador) {}

  // Un tick = un paso del reloj.
  public tick(): void {
    // Primero se atiende a los suspendidos: les baja la espera y los que terminan pasan a Preparados.
    this.avanzarSuspension();

    const actual = this.simulador.enEjecucion;

    // Caso 1: nadie está en la CPU, entonces baja el siguiente (si hay).
    if (actual === null || actual.bcp === null) {
      this.ponerEnEjecucion(this.simulador.preparados.extraerMenor());
      return;
    }

    // Caso 2: hay un proceso corriendo, gasta 1 unidad de tiempo restante...
    actual.bcp.gastarTiempo();
    // ...y 1 unidad de su turno.
    this.simulador.turnoGastado++;

    // ¿Terminó el proceso o se acabó su turno? Entonces hay cambio.
    const terminado = actual.bcp.estaTerminado;
    const turnoAcabado = this.simulador.turnoGastado >= actual.bcp.quantum;
    if (terminado || turnoAcabado) {
      this.cambiarProceso();
    }
  }

  // A cada proceso suspendido le baja 1 la espera. Si ya no le queda espera,
  // sale de Suspendido y entra al árbol de Preparados.
  private avanzarSuspension(): void {
    // Recorro una COPIA de la lista, porque reanudarProceso va sacando
    // procesos de la lista original mientras la recorro.
    const copiaDeSuspendidos = [...this.simulador.suspendidos];

    for (const proceso of copiaDeSuspendidos) {
      if (proceso.bcp === null) continue;

      proceso.bcp.gastarTiempoInteractividad();

      if (!proceso.bcp.tieneSuspensionPendiente) {
        this.simulador.reanudarProceso(proceso);
      }
    }
  }

  // Hace el cambio descrito en "El ciclo de ejecución".
  // Hace el cambio descrito en "El ciclo de ejecución", ahora con Suspendido.
  private cambiarProceso(): void {
    const saliente = this.simulador.enEjecucion;
    if (saliente === null || saliente.bcp === null) return;

    // Guardo esto ANTES, porque terminarProceso le quita el BCP.
    const terminado = saliente.bcp.estaTerminado;
    // Solo se suspende si NO terminó y todavía tiene espera pendiente.
    const debeSuspenderse = !terminado && saliente.bcp.tieneSuspensionPendiente;
    // Si no terminó ni se suspende, vuelve al árbol de Preparados.
    const debeVolverAPreparados = !terminado && !debeSuspenderse;

    // Paso 1: primero baja el siguiente del árbol.
    const siguiente = this.simulador.preparados.extraerMenor();

    // Árbol vacío y el proceso debía volver a Preparados:
    // el mismo proceso sigue en la CPU, con un turno nuevo.
    if (siguiente === null && debeVolverAPreparados) {
      this.simulador.turnoGastado = 0;
      return;
    }

    // Paso 2: el proceso que sale va a su destino.
    if (terminado) {
      this.simulador.terminarProceso(saliente); // pierde el BCP, vuelve a Programas
    } else if (debeSuspenderse) {
      this.simulador.suspenderProceso(saliente); // espera en Suspendido
    } else {
      saliente.estado = "preparado";
      this.simulador.preparados.insertar(saliente); // vuelve al árbol
    }

    // Paso 3: la CPU queda ocupada por el siguiente, o libre si no había nadie.
    if (siguiente !== null) {
      this.ponerEnEjecucion(siguiente);
    } else {
      this.simulador.enEjecucion = null;
      this.simulador.turnoGastado = 0;
    }
  }

  // Sube un proceso a la CPU y empieza su turno desde cero.
  private ponerEnEjecucion(proceso: Proceso | null): void {
    if (proceso === null) return;
    
    proceso.estado = "ejecucion";
    this.simulador.enEjecucion = proceso;
    this.simulador.turnoGastado = 0;
  }
}