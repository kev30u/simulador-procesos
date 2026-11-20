import { Simulador } from "./Simulador";
import { Proceso } from "../modelos/Proceso";

export class Planificador {
  private simulador: Simulador;

  constructor(simulador: Simulador) {
    this.simulador = simulador;
  }

  // ======================================================
  public tick(): void {
    this.avanzarSuspension();

    const procesoActual = this.simulador.enEjecucion;

    // CPU libre: sube el siguiente proceso de Preparados (si hay).
    if (procesoActual === null || procesoActual.bcp === null) {
      const siguiente = this.simulador.preparados.extraerMenor();
      this.ponerEnEjecucion(siguiente);
      return;
    }

    // CPU ocupada: el proceso gasta 1 unidad de tiempo y 1 de su turno.
    procesoActual.bcp.gastarTiempo();
    this.simulador.turnoGastado++;

    const procesoTerminado = procesoActual.bcp.estaTerminado;
    const turnoAcabado = this.simulador.turnoGastado >= procesoActual.bcp.quantum;

    if (procesoTerminado || turnoAcabado) {
      this.cambiarProceso();
    }
  }

  // =======================================================
  private avanzarSuspension(): void {
    // A cada suspendido le baja 1 la espera; si ya no le queda, vuelve a Preparados.
    // Se recorre una copia porque reanudarProceso saca procesos
    // de la lista original y nos saltaríamos alguno.
    const copiaDeSuspendidos = this.simulador.suspendidos.slice();

    for (const proceso of copiaDeSuspendidos) {
      if (proceso.bcp !== null) {
        proceso.bcp.gastarTiempoInteractividad();

        if (!proceso.bcp.tieneSuspensionPendiente) {
          this.simulador.reanudarProceso(proceso);
        }
      }
    }
  }

  // ======================================================
  private cambiarProceso(): void {
    const procesoSaliente = this.simulador.enEjecucion;

    if (procesoSaliente === null || procesoSaliente.bcp === null) {
      return;
    }

    // Se calcula antes de mover el proceso, porque terminarProceso le quita el BCP.
    const haTerminado = procesoSaliente.bcp.estaTerminado;
    const debeSuspenderse = (!haTerminado && procesoSaliente.bcp.tieneSuspensionPendiente);
    const debeVolverAPreparados = (!haTerminado && !debeSuspenderse);

    const procesoSiguiente = this.simulador.preparados.extraerMenor();

    // Si no hay nadie más en Preparados, el mismo proceso sigue con un turno nuevo.
    if (procesoSiguiente === null && debeVolverAPreparados) {
      this.simulador.turnoGastado = 0;
      return;
    }

    if (haTerminado) {
      this.simulador.terminarProceso(procesoSaliente);
    } else if (debeSuspenderse) {
      this.simulador.suspenderProceso(procesoSaliente);
    } else {
      procesoSaliente.estado = "preparado";
      this.simulador.preparados.insertar(procesoSaliente);
    }

    if (procesoSiguiente !== null) {
      this.ponerEnEjecucion(procesoSiguiente);
    } else {
      this.simulador.enEjecucion = null;
      this.simulador.turnoGastado = 0;
    }
  }

  // ======================================================
  private ponerEnEjecucion(proceso: Proceso | null): void {
    if (proceso === null) {
      return;
    }

    proceso.estado = "ejecucion";
    this.simulador.enEjecucion = proceso;
    this.simulador.turnoGastado = 0;
  }
}