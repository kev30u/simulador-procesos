import { BCP } from "../modelos/BCP";
import { Proceso } from "../modelos/Proceso";
// import { ArbolBinario } from "../estructuras/ArbolBinario";
import { ListaPreparados } from "../estructuras/ListaPreparados";
import { ArbolPrioridadMinima } from "../estructuras/ArbolPrioridadMinima";

export class Simulador {

  // Cuántas unidades lleva gastadas el proceso en ejecución dentro de su turno.
  public turnoGastado: number = 0;

  // Los programas son Procesos que todavía no tienen BCP.
  public programas: Proceso[] = [];

  // Árbol de preparados: el siguiente en ejecutarse es el más a la izquierda.
//   public preparados: ArbolBinario = new ArbolBinario();
  // public preparados: ListaPreparados = new ListaPreparados();
  public preparados: ArbolPrioridadMinima = new ArbolPrioridadMinima();
  // Proceso que está usando la CPU ahora. Es null si no hay ninguno.
  public enEjecucion: Proceso | null = null;

  // Recibe los nombres de los programas con los que arranca el simulador.
  constructor(private nombresIniciales: string[]) {
    this.cargarProgramas();
  }

  private cargarProgramas(): void {
    this.programas = this.nombresIniciales.map((nombre) => new Proceso(nombre));
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

  // Convierte un Proceso en un objeto sencillo, listo para mandarse como JSON.
  private resumir(proceso: Proceso) {
    const bcp = proceso.bcp;
    return {
      nombre: proceso.nombre,
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
            },
    };
  }

  public obtenerEstado() {
    return {
      programas: this.programas.map((p) => this.resumir(p)),
      preparados: this.preparados.recorrerEnOrden().map((p) => this.resumir(p)),
      enEjecucion:
        this.enEjecucion === null ? null : this.resumir(this.enEjecucion),
      turnoGastado: this.turnoGastado,
    };
  }

  public reiniciar(): void {
    BCP.reiniciarContador();
    this.preparados = new ArbolPrioridadMinima();
    this.enEjecucion = null;
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

// Dos cosas para confirmar con A:

// Nombres exactos de los métodos. Si A los llama distinto, 
// o si estaVacio es un getter (sin paréntesis), ajustas esa línea y ya.
// Qué devuelve extraerMenor() cuando el árbol está vacío. Yo asumí null. 
// Si A devuelve undefined, tu Planificador debe revisarlo igual.


  