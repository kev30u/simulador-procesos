"use client";

import { useLayoutEffect, useEffect, useRef, type RefObject } from "react";

// Anima con FLIP las tarjetas y bolitas que tengan data-proceso-id
// cuando cambian de panel o de orden en Preparados.
export function useProcesoFlip(
  contenedorRef: RefObject<HTMLElement | null>,
  claveDisposicion: string,
): void {
  const posicionesPrevias = useRef<Map<string, DOMRect>>(new Map());
  const animacionesActivas = useRef<Map<string, Animation>>(new Map());

  useEffect(() => {
    function actualizarPosiciones() {
      const raiz = contenedorRef.current;
      if (raiz === null) return;

      const nodos = raiz.querySelectorAll<HTMLElement>("[data-proceso-id]");
      const mapa = new Map<string, DOMRect>();
      nodos.forEach((nodo) => {
        const id = nodo.dataset.procesoId;
        if (id) {
          mapa.set(id, nodo.getBoundingClientRect());
        }
      });
      posicionesPrevias.current = mapa;
    }

    let rafId = 0;
    function alRedimensionar() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(actualizarPosiciones);
    }

    window.addEventListener("resize", alRedimensionar);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", alRedimensionar);
    };
  }, [contenedorRef]);

  useLayoutEffect(() => {
    const raiz = contenedorRef.current;
    if (raiz === null) return;

    const nodos = Array.from(
      raiz.querySelectorAll<HTMLElement>("[data-proceso-id]"),
    );

    // Fase 1 (Read): leer todas las posiciones nuevas de una sola vez.
    const posicionesNuevas = new Map<string, DOMRect>();
    for (const nodo of nodos) {
      const id = nodo.dataset.procesoId;
      if (!id) continue;

      const animAnterior = animacionesActivas.current.get(id);
      if (animAnterior) {
        animAnterior.cancel();
        animacionesActivas.current.delete(id);
      }
      posicionesNuevas.set(id, nodo.getBoundingClientRect());
    }

    const reduceMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Fase 2 (Write): invertir y animar en GPU únicamente con transform.
    if (!reduceMovimiento && posicionesPrevias.current.size > 0) {
      for (const nodo of nodos) {
        const id = nodo.dataset.procesoId;
        if (!id) continue;

        const previa = posicionesPrevias.current.get(id);
        const actual = posicionesNuevas.get(id);
        if (!previa || !actual) continue;

        const dx = previa.left - actual.left;
        const dy = previa.top - actual.top;

        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;

        nodo.style.willChange = "transform";
        nodo.style.position = "relative";
        nodo.style.zIndex = "20";

        const anim = nodo.animate(
          [
            { transform: `translate3d(${dx}px, ${dy}px, 0)` },
            { transform: "translate3d(0, 0, 0)" },
          ],
          {
            duration: 240,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          },
        );

        animacionesActivas.current.set(id, anim);
        anim.onfinish = () => {
          nodo.style.willChange = "";
          nodo.style.zIndex = "";
          animacionesActivas.current.delete(id);
        };
        anim.oncancel = () => {
          nodo.style.willChange = "";
          nodo.style.zIndex = "";
        };
      }
    }

    posicionesPrevias.current = posicionesNuevas;
  }, [contenedorRef, claveDisposicion]);
}
