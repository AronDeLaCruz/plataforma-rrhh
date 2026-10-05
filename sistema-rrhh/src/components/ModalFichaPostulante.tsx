import { useEffect, useState } from "react";
import { DOCUMENTOS, ID_FICHA_PERSONAL, contarDocumentosSubidos, obtenerArchivoDocumento, obtenerDocumentoAdjunto, obtenerIdDocumento } from "@/constants/documentos";
import { postulacionService, resolverUrlArchivo } from "@/services/api";
import type { PostulacionDetalle, Postulante } from "@/types";

interface ModalFichaPostulanteProps {
    postulante: Postulante | null;
    onClose: () => void;
}

const TIPOS_DOCUMENTO: Record<string, string> = {
    "1": "DNI",
    "2": "Carnet de Extranjería",
};

export default function ModalFichaPostulante({ postulante, onClose }: ModalFichaPostulanteProps) {
    const [docSelId, setDocSelId] = useState<number>(ID_FICHA_PERSONAL);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [errorPdf, setErrorPdf] = useState<string | null>(null);
    const [detalle, setDetalle] = useState<PostulacionDetalle | null>(null);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);
    const [errorDetalle, setErrorDetalle] = useState<string | null>(null);

    // Los documentos salen del detalle; si todavía no llegó, se usa lo que traiga el listado.
    const documentos = detalle?.documentos ?? postulante?.documentos;

    // El modal se remonta con `key` cuando cambia el postulante, así el documento
    // seleccionado vuelve siempre a la ficha de datos (id 1).
    const adjunto = postulante ? obtenerDocumentoAdjunto(documentos, docSelId) : null;

    // El backend descarga el archivo por el id del registro del documento (el "código" del PDF),
    // no por la ruta del archivo: `GET /Postulacion/{id}/documento`.
    const documentoId = obtenerIdDocumento(documentos, docSelId);

    // Ruta del archivo en el servidor (ej. "/files/postulaciones/..."). Solo se usa como respaldo.
    const archivoUrl = obtenerArchivoDocumento(documentos, docSelId);

    // Fuente del visor: el blob descargado con la sesión autenticada o, cuando el backend no
    // expone el id del registro, la ruta estática del archivo (se sirve desde la raíz del servidor).
    const visorUrl = pdfUrl ?? (documentoId || !archivoUrl ? null : resolverUrlArchivo(archivoUrl));

    // El listado (GET /Postulacion) no trae los documentos: se piden en el detalle al abrir la ficha.
    // El modal se remonta con `key` cuando cambia el postulante, así que corre una vez por ficha.
    useEffect(() => {
        if (!postulante) return;

        let cancelado = false;

        const cargarDetalle = async () => {
            try {
                setCargandoDetalle(true);
                setErrorDetalle(null);
                const data = await postulacionService.detalles(String(postulante.id));
                if (cancelado) return;
                setDetalle(data);
            } catch (err) {
                if (cancelado) return;
                console.error("Error al obtener el detalle de la postulación:", err);
                setErrorDetalle("No se pudo cargar el detalle de la postulación.");
            } finally {
                if (!cancelado) setCargandoDetalle(false);
            }
        };

        void cargarDetalle();

        return () => {
            cancelado = true;
        };
    }, [postulante]);

    // Descarga el PDF con la sesión autenticada (GET /Postulacion/{id}/documento) y lo publica
    // como blob URL para el visor.
    useEffect(() => {
        if (docSelId === ID_FICHA_PERSONAL || !documentoId) return;

        let cancelado = false;
        let objectUrl: string | null = null;

        const cargarPdf = async () => {
            try {
                const blob = await postulacionService.documento(documentoId);
                if (cancelado) return;
                objectUrl = URL.createObjectURL(blob);
                setPdfUrl(objectUrl);
            } catch (err) {
                if (cancelado) return;
                console.error("Error al cargar el documento:", err);
                setErrorPdf("No se pudo cargar el documento en el visor.");
            }
        };

        void cargarPdf();

        return () => {
            cancelado = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [docSelId, documentoId]);

    // Cierra con la tecla Escape
    useEffect(() => {
        if (!postulante) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [postulante, onClose]);

    if (!postulante) return null;

    const seleccionarDocumento = (id: number) => {
        setDocSelId(id);
        setPdfUrl(null);
        setErrorPdf(null);
    };

    const nombreCompleto = postulante.nombreCompleto
        ?? [postulante.nombre, postulante.apellido].filter(Boolean).join(" ");
    const tipoDocumento = TIPOS_DOCUMENTO[postulante.tipoDocumento ?? ""] ?? postulante.tipoDocumento ?? "-";
    const estado = postulante.estado ?? "Pendiente";

    const datos = [
        { etiqueta: "Código", valor: String(postulante.codigo ?? postulante.id) },
        { etiqueta: "Apellidos y Nombres", valor: nombreCompleto || "-" },
        { etiqueta: "Tipo de Documento", valor: tipoDocumento },
        { etiqueta: "Documento", valor: postulante.dni ?? postulante.numeroDocumento ?? "-" },
        { etiqueta: "Email", valor: postulante.email ?? "-" },
        { etiqueta: "Teléfono", valor: postulante.telefono ?? "-" },
        { etiqueta: "Puesto", valor: postulante.puesto ?? postulante.puestoNombre ?? "-" },
    ];

    const docSel = DOCUMENTOS.find((documento) => documento.id === docSelId) ?? DOCUMENTOS[0];
    const esFicha = docSelId === ID_FICHA_PERSONAL;
    const subidos = contarDocumentosSubidos(documentos);

    const renderPreview = () => {
        if (esFicha) {
            return (
                <div className="ficha-grid">
                    {datos.map((dato) => (
                        <div className="ficha-dato" key={dato.etiqueta}>
                            <span>{dato.etiqueta}</span>
                            <strong>{dato.valor}</strong>
                        </div>
                    ))}
                    <div className="ficha-dato">
                        <span>Estado</span>
                        <strong>
                            <span className={`badge state-${estado.toLowerCase()}`}>{estado}</span>
                        </strong>
                    </div>
                </div>
            );
        }

        if (cargandoDetalle && !detalle) {
            return <p className="doc-empty">Cargando documentos...</p>;
        }

        if (!adjunto) {
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
            return <p className="doc-empty">Cargando documento...</p>;
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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content ficha-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Ficha del Postulante</h3>
                <p className="ficha-subtitulo">
                    {nombreCompleto || "-"} · Documento: {postulante.dni ?? postulante.numeroDocumento ?? "-"}
                </p>

                <div className="ficha-body">
                    {/* Listado completo de documentos del sistema */}
                    <div className="doc-panel">
                        <p className="doc-panel-title">
                            Documentos{" "}
                            <span>
                                {cargandoDetalle && !detalle
                                    ? "cargando..."
                                    : `${subidos} / ${DOCUMENTOS.length - 1} adjuntos`}
                            </span>
                        </p>
                        {errorDetalle && <p className="doc-empty">{errorDetalle}</p>}
                        <ul className="doc-lista">
                            {DOCUMENTOS.map((documento) => {
                                const esFichaDoc = documento.id === ID_FICHA_PERSONAL;
                                const subido = esFichaDoc
                                    || obtenerDocumentoAdjunto(documentos, documento.id) !== null;
                                return (
                                    <li key={documento.id}>
                                        <button
                                            type="button"
                                            className={`doc-item ${documento.id === docSelId ? "active" : ""}`}
                                            onClick={() => seleccionarDocumento(documento.id)}
                                            title={documento.nombre}
                                        >
                                            <span className="doc-nombre">{documento.nombre}</span>
                                            <span className={`doc-estado ${esFichaDoc ? "datos" : subido ? "subido" : "pendiente"}`}>
                                                {esFichaDoc ? "Datos" : subido ? "Subido" : "Pendiente"}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Visor: datos del postulante (ficha) o el PDF del documento seleccionado */}
                    <div className="doc-preview">
                        <p className="doc-preview-title">{docSel.nombre}</p>
                        <div className="doc-preview-body">{renderPreview()}</div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
