import { useEffect, useState } from "react";
import ModalDetalleLegajo from "./ModalDetalleLegajo";
import { legajoService } from "@/services/api";
import type { Empleado, Legajo } from "@/types";

interface ModalLegajoProps {
    empleado: Empleado | null;
    onClose: () => void;
}

/** Color del badge según el estado de la postulación. */
function claseEstado(estado: string): string {
    const valor = estado.trim().toLowerCase();
    if (["aprobado", "activo", "contratado", "aceptado"].includes(valor)) return "aprobado";
    if (["rechazado", "inactivo", "descartado", "cesado"].includes(valor)) return "rechazado";
    return "pendiente";
}

export default function ModalLegajo({ empleado, onClose }: ModalLegajoProps) {
    // Estos valores se calculan una vez por apertura: el modal se remonta con `key`
    // cuando cambia el empleado, por eso el estado se reinicia solo.
    const dni = empleado?.dni ?? null;
    const legajosDelListado = empleado?.legajos.length ?? 0;

    // Legajos (carpetas) del empleado: los que vengan en el listado y, si no trae ninguno,
    // los que devuelva el detalle consultado por DNI.
    const [legajos, setLegajos] = useState<Legajo[]>(() => empleado?.legajos ?? []);
    const [cargandoLegajos, setCargandoLegajos] = useState(false);
    const [errorLegajos, setErrorLegajos] = useState<string | null>(null);

    // Postulación seleccionada para ver en detalle (modal secundario). Null = resumen.
    const [legajoDetalle, setLegajoDetalle] = useState<Legajo | null>(null);

    // El legajo se pide por DNI (GET /Postulante/{dni}/legajo) solo si el listado no lo trajo.
    // El guard es importante: al cerrar el modal el empleado pasa a null y, sin él, se dispararía
    // una consulta fantasma con el DNI indefinido (además de mostrar el error en pantalla).
    useEffect(() => {
        if (!dni || legajosDelListado > 0) return;

        let cancelado = false;

        const cargarLegajos = async () => {
            try {
                setCargandoLegajos(true);
                setErrorLegajos(null);
                const data = await legajoService.detalle(dni);
                if (cancelado) return;
                setLegajos(data);
            } catch (error) {
                if (cancelado) return;
                console.error("Error al obtener los legajos del empleado:", error);
                setErrorLegajos("No se pudo obtener el legajo desde el servicio.");
            } finally {
                if (!cancelado) setCargandoLegajos(false);
            }
        };

        void cargarLegajos();

        return () => {
            cancelado = true;
        };
    }, [dni, legajosDelListado]);

    // Cierra con Escape, salvo que el modal de detalle esté abierto (ese se cierra primero).
    useEffect(() => {
        if (!empleado) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !legajoDetalle) onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [empleado, onClose, legajoDetalle]);

    if (!empleado) return null;

    return (
        <div className="legajo-modal-overlay" onClick={onClose}>
            <div className="legajo-modal" onClick={(e) => e.stopPropagation()}>
                <div className="legajo-modal-header">
                    <div className="legajo-header-info">
                        <span className="legajo-avatar" aria-hidden="true">👤</span>
                        <div>
                            <p className="legajo-header-nombre">{empleado.apellidosNombres}</p>
                            <p className="legajo-header-sub">
                                <span className="codigo-documento">{empleado.codigo}</span>
                                <span className="legajo-header-cargo">{empleado.cargo}</span>
                            </p>
                        </div>
                    </div>
                    <button type="button" className="legajo-modal-close" onClick={onClose} aria-label="Cerrar">
                        ✕
                    </button>
                </div>

                {/* Datos de la persona (el código y el cargo ya están en el encabezado) */}
                <div className="legajo-datos">
                    <div className="legajo-dato">
                        <span>DNI</span>
                        <strong>{empleado.dni}</strong>
                    </div>
                    <div className="legajo-dato">
                        <span>Email</span>
                        <strong>{empleado.email}</strong>
                    </div>
                    <div className="legajo-dato">
                        <span>Teléfono</span>
                        <strong>{empleado.telefono}</strong>
                    </div>
                    <div className="legajo-dato">
                        <span>Fecha de Ingreso</span>
                        <strong>{empleado.fechaIngreso}</strong>
                    </div>
                    <div className="legajo-dato">
                        <span>Estado</span>
                        <strong>
                            <span className={`badge estado-${empleado.activo ? "activo" : "inactivo"}`}>
                                {empleado.activo ? "Activo" : "Inactivo"}
                            </span>
                        </strong>
                    </div>
                </div>

                {/* Resumen de las postulaciones: cada tarjeta abre su detalle en un modal secundario */}
                <div className="legajo-postulaciones">
                    <div className="legajo-seccion-head">
                        <h4>Postulaciones</h4>
                        <span className="legajo-contador">{legajos.length}</span>
                    </div>

                    {cargandoLegajos && legajos.length === 0 ? (
                        <p className="legajo-no-files">Cargando postulaciones...</p>
                    ) : errorLegajos ? (
                        <p className="legajo-no-files">{errorLegajos}</p>
                    ) : legajos.length === 0 ? (
                        <p className="legajo-no-files">Este empleado no tiene postulaciones registradas.</p>
                    ) : (
                        <ul className="postulaciones-grid">
                            {legajos.map((legajo) => {
                                const total = legajo.totalDocumentos ?? legajo.documentos.length;
                                const subidos = legajo.documentosSubidos ?? legajo.documentos.length;
                                const pct = total > 0 ? Math.min(100, Math.round((subidos / total) * 100)) : 0;
                                const estado = legajo.estado ?? "Pendiente";
                                return (
                                    <li key={legajo.id}>
                                        <button
                                            type="button"
                                            className="postulacion-card"
                                            onClick={() => setLegajoDetalle(legajo)}
                                            title="Ver detalle de la postulación"
                                        >
                                            <span className="postulacion-card-top">
                                                <span className={`postulacion-badge estado-${claseEstado(estado)}`}>
                                                    {estado}
                                                </span>
                                                <span className="postulacion-fecha">
                                                    {legajo.fechaPostulacion ?? "Sin fecha"}
                                                </span>
                                            </span>
                                            <span className="postulacion-puesto">{legajo.puesto ?? legajo.nombre}</span>
                                            <span className="postulacion-docs">
                                                {subidos} / {total} documentos
                                            </span>
                                            <span className="postulacion-bar">
                                                <span className="postulacion-bar-fill" style={{ width: `${pct}%` }} />
                                            </span>
                                            <span className="postulacion-cta">Ver detalle →</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* Modal de detalle: se remonta al cambiar de postulación para reiniciar su estado */}
            <ModalDetalleLegajo
                key={legajoDetalle?.id ?? "sin-detalle"}
                legajo={legajoDetalle}
                onClose={() => setLegajoDetalle(null)}
            />
        </div>
    );
}