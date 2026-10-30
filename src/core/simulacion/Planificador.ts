import { Simulador } from "./Simulador";
import { Proceso } from "../modelos/Proceso";

export class Planificador {
  // Guardo el simulador para poder leer y modificar sus zonas.
  constructor(private simulador: Simulador) {}

  // Un tick = un paso del reloj.
  public tick(): void {
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

  // Hace el cambio descrito en "El ciclo de ejecución".
  private cambiarProceso(): void {
    const saliente = this.simulador.enEjecucion;
    if (saliente === null || saliente.bcp === null) return;

    // Guardo esto ANTES, porque terminarProceso le quita el BCP.
    const terminado = saliente.bcp.estaTerminado;

    // Paso 1: primero baja el siguiente del árbol.
    const siguiente = this.simulador.preparados.extraerMenor();

    // Paso 2: después se decide qué pasa con el que sale.
    if (terminado) {
      this.simulador.terminarProceso(saliente); // pierde el BCP, vuelve a Programas
    } else if (siguiente !== null) {
      saliente.estado = "preparado";
      this.simulador.preparados.insertar(saliente); // vuelve al árbol
    }

    if (siguiente !== null) {
      this.ponerEnEjecucion(siguiente);
    } else if (terminado) {
      this.simulador.enEjecucion = null; // no queda nadie
      this.simulador.turnoGastado = 0;
    } else {
      // Árbol vacío: el mismo proceso vuelve a bajar con turno nuevo.
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