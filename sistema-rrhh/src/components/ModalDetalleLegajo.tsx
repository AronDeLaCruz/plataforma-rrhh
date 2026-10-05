import { useEffect, useState } from "react";
import { postulacionService, resolverUrlArchivo } from "@/services/api";
import type { Legajo } from "@/types";

interface ModalDetalleLegajoProps {
    legajo: Legajo | null;
    onClose: () => void;
}

/** Color del badge según el estado de la postulación. */
function claseEstado(estado: string): string {
    const valor = estado.trim().toLowerCase();
    if (["aprobado", "activo", "contratado", "aceptado"].includes(valor)) return "aprobado";
    if (["rechazado", "inactivo", "descartado", "cesado"].includes(valor)) return "rechazado";
    return "pendiente";
}

/**
 * Modal secundario con el detalle de una postulación: lista de documentos a la izquierda y el
 * visor del PDF a la derecha. Se abre desde el resumen de `ModalLegajo` y se remonta con `key`
 * al cambiar de postulación (igual que el resto de modales de la app).
 */
export default function ModalDetalleLegajo({ legajo, onClose }: ModalDetalleLegajoProps) {
    // Índice del documento seleccionado; el estado se reinicia solo porque el componente se remonta.
    const [docSelIdx, setDocSelIdx] = useState(0);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [cargandoPdf, setCargandoPdf] = useState(false);
    const [errorPdf, setErrorPdf] = useState<string | null>(null);

    const docSel = legajo?.documentos[docSelIdx] ?? legajo?.documentos[0] ?? null;

    // El backend descarga el archivo por el id del registro del documento; la ruta del archivo
    // (`archivoUrl`) queda como respaldo cuando el id no viene.
    const documentoId = docSel?.id ?? null;
    const archivoUrl = docSel?.archivoUrl ?? null;
    const tieneArchivo = Boolean(documentoId || archivoUrl);

    // Fuente del visor: el blob descargado con la sesión autenticada o la ruta estática como respaldo.
    const visorUrl = pdfUrl ?? (documentoId || !archivoUrl ? null : resolverUrlArchivo(archivoUrl));

    // Escape cierra solo este modal (el resumen sigue abierto detrás).
    useEffect(() => {
        if (!legajo) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [legajo, onClose]);

    // Descarga el PDF con la sesión autenticada y lo publica como blob URL para el visor.
    useEffect(() => {
        if (!legajo || !documentoId) return;

        let cancelado = false;
        let objectUrl: string | null = null;

        const cargarPdf = async () => {
            try {
                setCargandoPdf(true);
                setErrorPdf(null);
                const blob = await postulacionService.documento(documentoId);
                if (cancelado) return;
                objectUrl = URL.createObjectURL(blob);
                setPdfUrl(objectUrl);
            } catch (err) {
                if (cancelado) return;
                console.error("Error al cargar el documento del legajo:", err);
                setErrorPdf("No se pudo cargar el documento en el visor.");
            } finally {
                if (!cancelado) setCargandoPdf(false);
            }
        };

        void cargarPdf();

        return () => {
            cancelado = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [legajo, documentoId]);

    if (!legajo) return null;

    const seleccionarDocumento = (indice: number) => {
        setDocSelIdx(indice);
        setPdfUrl(null);
        setErrorPdf(null);
    };

    const renderPreview = () => {
        if (!docSel) {
            return <p className="doc-empty">Esta postulación no tiene documentos.</p>;
        }

        if (!tieneArchivo) {
            return <p className="doc-empty">Este documento todavía no fue adjuntado.</p>;
        }

        if (errorPdf) {
            return (
                <p className="doc-empty">
                    {errorPdf}{" "}
                    {archivoUrl && (
                        <a href={resolverUrlArchivo(archivoUrl)} target="_blank" rel="noreferrer">
                            Abrir el archivo en una pestaña nueva
                        </a>
                    )}
                </p>
            );
        }

        if (!visorUrl) {
            return (
                <p className="doc-empty">
                    {cargandoPdf ? "Cargando documento..." : "No se pudo obtener el archivo."}
                </p>
            );
        }

        return (
            <>
                <iframe className="doc-pdf" src={visorUrl} title={docSel.nombre} />
                <div className="doc-pdf-actions">
                    <a href={visorUrl} target="_blank" rel="noreferrer">
                        Abrir en pestaña nueva
                    </a>
                    <a href={visorUrl} download={docSel.nombre}>
                        Descargar
                    </a>
                </div>
            </>
        );
    };

    const estado = legajo.estado ?? "Pendiente";

    return (
        <div className="legajo-detalle-overlay" onClick={onClose}>
            <div className="legajo-detalle-modal" onClick={(e) => e.stopPropagation()}>
                <div className="legajo-modal-header">
                    <div>
                        <p className="legajo-detalle-titulo">
                            {legajo.puesto ?? legajo.nombre}
                            <span className={`postulacion-badge estado-${claseEstado(estado)}`}>{estado}</span>
                        </p>
                        <p className="legajo-detalle-subtitulo">
                            {legajo.fechaPostulacion
                                ? `Postulación del ${legajo.fechaPostulacion}`
                                : "Detalle de la postulación"}
                        </p>
                    </div>
                    <button type="button" className="legajo-modal-close" onClick={onClose} aria-label="Cerrar">
                        ✕
                    </button>
                </div>

                <div className="legajo-detalle-body">
                    {/* Lista de documentos de la postulación */}
                    <div className="doc-panel">
                        <p className="doc-panel-title">
                            Documentos <span>{legajo.documentos.length}</span>
                        </p>
                        {legajo.documentos.length === 0 ? (
                            <p className="legajo-no-files">Esta postulación no tiene documentos.</p>
                        ) : (
                            <ul className="doc-lista">
                                {legajo.documentos.map((doc, indice) => (
                                    <li key={`${doc.id ?? doc.nombre}-${indice}`}>
                                        <button
                                            type="button"
                                            className={`doc-item ${indice === docSelIdx ? "active" : ""}`}
                                            onClick={() => seleccionarDocumento(indice)}
                                            title={doc.nombre}
                                        >
                                            <span className="doc-nombre">{doc.nombre}</span>
                                            <span className={`file-tipo file-tipo-${doc.tipo.toLowerCase()}`}>
                                                {doc.tipo}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Visor del PDF del documento seleccionado */}
                    <div className="doc-preview">
                        <p className="doc-preview-title">{docSel?.nombre ?? "Visor"}</p>
                        <div className="doc-preview-body">{renderPreview()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}