import { BCP } from "../modelos/BCP";
import { Proceso, type ProgramaInicial } from "../modelos/Proceso";
import { ArbolPrioridadMinima } from "../estructuras/ArbolPrioridadMinima";

export class Simulador {

  // Cuántas unidades lleva gastadas el proceso en ejecución dentro de su turno.
  public turnoGastado: number = 0;

  // Los programas son Procesos que todavía no tienen BCP.
  public programas: Proceso[] = [];

  // Árbol de preparados: el siguiente en ejecutarse es el más a la izquierda.
  public preparados: ArbolPrioridadMinima = new ArbolPrioridadMinima();

  // Proceso que está usando la CPU ahora. Es null si no hay ninguno.
  public enEjecucion: Proceso | null = null;

    // Procesos que están esperando en Suspendido. Cada uno lleva su propia cuenta en el BCP.
  public suspendidos: Proceso[] = [];

  // Recibe los nombres y colores iniciales de los programas.
  constructor(private programasIniciales: ProgramaInicial[]) {
    this.cargarProgramas();
  }

  private cargarProgramas(): void {
    this.programas = this.programasIniciales.map(
      (programa) => new Proceso(programa.nombre, programa.color),
    );
  }

  // Programa -> Preparados: se le crea el BCP y entra al árbol.
  public iniciarProceso(proceso: Proceso): void {
    this.programas = this.programas.filter((p) => p !== proceso);
    proceso.asignarBCP(new BCP());
    proceso.estado = "preparado";
    this.preparados.insertar(proceso);
  }

  // Proceso -> Programas: pierde el BCP y vuelve a la lista.
  public terminarProceso(proceso: Proceso): void {
    proceso.quitarBCP();
    proceso.estado = "inactivo";
    this.programas.push(proceso);
  }

    // Ejecución -> Suspendido: el proceso sale de la CPU y espera en la lista de suspendidos.
  public suspenderProceso(proceso: Proceso): void {
    proceso.estado = "suspendido";
    this.suspendidos.push(proceso);
  }

  // Suspendido -> Preparados: sale de la lista de suspendidos y entra al árbol.
  public reanudarProceso(proceso: Proceso): void {
    // filter se queda con todos los suspendidos MENOS este.
    this.suspendidos = this.suspendidos.filter((p) => p !== proceso);
    proceso.estado = "preparado";
    this.preparados.insertar(proceso);
  }

  // Convierte un Proceso en un objeto sencillo, listo para mandarse como JSON.
  private resumir(proceso: Proceso) {
    const bcp = proceso.bcp;
    return {
      nombre: proceso.nombre,
      color: proceso.color,
      estado: proceso.estado,
      bcp:
        bcp === null
          ? null
          : {
              pid: bcp.pid,
              quantum: bcp.quantum,
              prioridad: bcp.prioridad,
              interactividad: bcp.interactividad,
              tiempoCpu: bcp.tiempoCpu,
              tiempoRestante: bcp.tiempoRestante,
              tiempoInteractividadRestante: bcp.tiempoInteractividadRestante,
            },
    };
  }

  public obtenerEstado() {
    return {
      programas: this.programas.map((p) => this.resumir(p)),
      preparados: this.preparados.recorrerEnOrden().map((p) => this.resumir(p)),
      suspendidos: this.suspendidos.map((p) => this.resumir(p)),
      enEjecucion:
        this.enEjecucion === null ? null : this.resumir(this.enEjecucion),
      turnoGastado: this.turnoGastado,
    };
  }

  public reiniciar(): void {
    BCP.reiniciarContador();
    this.preparados = new ArbolPrioridadMinima();
    this.enEjecucion = null;
    this.suspendidos = [];
    this.turnoGastado = 0;
    this.cargarProgramas();
  }

  // Pasa a Preparados el programa que se llame así. Devuelve false si no existe.
  public iniciarPorNombre(nombre: string): boolean {
    const programa = this.programas.find((p) => p.nombre === nombre);
    if (programa === undefined) return false;
    this.iniciarProceso(programa);
    return true;
  }
}



  