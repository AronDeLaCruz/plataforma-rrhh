import { useEffect, useMemo, useState } from "react";
import "./Legajos.css";
import ModalLegajo from "./ModalLegajo";
import { legajoService } from "@/services/api";
import type { DocumentoLegajo, Empleado, Legajo } from "@/types";

const LETRAS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

/** Documento de ejemplo: sin id de backend, por eso no se puede descargar. */
const docEjemplo = (nombre: string, tipo: string): DocumentoLegajo => ({ id: null, nombre, tipo });

// Postulaciones de ejemplo (cada una es una carpeta del legajo). Cada una con sus documentos.
const crearLegajos = (): Legajo[] => [
    {
        id: "postulacion-1",
        nombre: "Desarrollador Frontend · Aprobado",
        puesto: "Desarrollador Frontend",
        estado: "Aprobado",
        fechaPostulacion: "2021-02-10",
        documentosSubidos: 2,
        totalDocumentos: 15,
        tieneFicha: true,
        documentos: [
            docEjemplo("Ficha de Personal", "Datos"),
            docEjemplo("DNI.pdf", "Documento"),
            docEjemplo("Ficha de Datos.pdf", "Documento"),
        ],
    },
    {
        id: "postulacion-2",
        nombre: "Analista de Datos · Pendiente",
        puesto: "Analista de Datos",
        estado: "Pendiente",
        fechaPostulacion: "2023-05-22",
        documentosSubidos: 1,
        totalDocumentos: 15,
        tieneFicha: true,
        documentos: [
            docEjemplo("Ficha de Personal", "Datos"),
            docEjemplo("Curriculum Vitae.pdf", "Documento"),
        ],
    },
    {
        id: "postulacion-3",
        nombre: "Soporte Técnico · Rechazado",
        puesto: "Soporte Técnico",
        estado: "Rechazado",
        fechaPostulacion: "2022-09-03",
        documentosSubidos: 1,
        totalDocumentos: 15,
        tieneFicha: false,
        documentos: [docEjemplo("Solicitud de Empleo.pdf", "Documento")],
    },
];

// Datos de ejemplo que se muestran solo si el servicio de legajos todavía no responde (el backend no existe aún).
const EMPLEADOS_INICIALES: Empleado[] = [
    { id: null, codigo: "EMP-0001", apellidosNombres: "García López, Juan", activo: true, dni: "45236178", email: "juan.garcia@empresa.com", telefono: "987654321", cargo: "Desarrollador Frontend", fechaIngreso: "2021-03-15", legajos: crearLegajos() },
    { id: null, codigo: "EMP-0002", apellidosNombres: "Martínez Paredes, Ana", activo: true, dni: "40124557", email: "ana.martinez@empresa.com", telefono: "912345678", cargo: "Analista RRHH", fechaIngreso: "2019-08-01", legajos: crearLegajos() },
    { id: null, codigo: "EMP-0003", apellidosNombres: "Quispe Rojas, Pedro", activo: false, dni: "47895612", email: "pedro.quispe@empresa.com", telefono: "987123456", cargo: "QA Engineer", fechaIngreso: "2022-01-10", legajos: crearLegajos() },
    { id: null, codigo: "EMP-0004", apellidosNombres: "Ramírez Torres, Luis", activo: true, dni: "42356897", email: "luis.ramirez@empresa.com", telefono: "956789123", cargo: "Desarrollador Backend", fechaIngreso: "2020-06-22", legajos: crearLegajos() },
    { id: null, codigo: "EMP-0005", apellidosNombres: "Sánchez Huamán, María", activo: true, dni: "46523178", email: "maria.sanchez@empresa.com", telefono: "934567891", cargo: "Diseñadora UX", fechaIngreso: "2023-02-14", legajos: crearLegajos() },
    { id: null, codigo: "EMP-0006", apellidosNombres: "Torres Benites, Carla", activo: false, dni: "42157896", email: "carla.torres@empresa.com", telefono: "923456789", cargo: "Asistente Contable", fechaIngreso: "2018-11-05", legajos: crearLegajos() },
];

export default function Legajos() {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [letraSel, setLetraSel] = useState<string>("");
    const [empleadoSel, setEmpleadoSel] = useState<Empleado | null>(null);
    const [loading, setLoading] = useState(true);
    const [aviso, setAviso] = useState<string | null>(null);

    // Pide el listado al servicio (GET /Postulante). Si la consulta falla, se cae a los
    // datos de ejemplo para no dejar la pantalla vacía.
    useEffect(() => {
        let cancelado = false;

        const cargarLegajos = async () => {
            try {
                setLoading(true);
                setAviso(null);
                const data = await legajoService.listado();
                if (cancelado) return;
                setEmpleados(data);
            } catch (error) {
                if (cancelado) return;
                console.error("Error al obtener los legajos:", error);
                setAviso("No se pudo obtener el listado desde el servicio de legajos. Mostrando datos de ejemplo.");
                setEmpleados(EMPLEADOS_INICIALES);
            } finally {
                if (!cancelado) setLoading(false);
            }
        };

        void cargarLegajos();

        return () => {
            cancelado = true;
        };
    }, []);

    // Filtra por texto de búsqueda y por inicial seleccionada
    const filtrados: Empleado[] = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        return empleados.filter((e) => {
            const coincideLetra = !letraSel || e.apellidosNombres.charAt(0).toUpperCase() === letraSel;
            const coincideBusqueda =
                !q ||
                e.codigo.toLowerCase().includes(q) ||
                e.apellidosNombres.toLowerCase().includes(q);
            return coincideLetra && coincideBusqueda;
        });
    }, [empleados, busqueda, letraSel]);

    return (
        <div className="legajos-view">
            {/* Barra superior: título de la vista y buscador */}
            <div className="legajos-navbar">
                <div>
                    <h2>Legajo de Empleados</h2>
                    <p>Busca y consulta el legajo documental de cada empleado.</p>
                </div>
                <div className="legajos-search">
                    <input
                        type="search"
                        placeholder="Buscar por documento o nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <span className="search-icon" aria-hidden="true">🔍</span>
                </div>
            </div>

            {/* Navegación por inicial del apellido (A-Z) */}
            <div className="letras">
                <ul>
                    <li>
                        <button
                            type="button"
                            className={letraSel === "" ? "selected" : ""}
                            onClick={() => setLetraSel("")}
                        >
                            Todos
                        </button>
                    </li>
                    {LETRAS.map((letra) => (
                        <li key={letra}>
                            <button
                                type="button"
                                className={letraSel === letra ? "selected" : ""}
                                onClick={() => setLetraSel(letraSel === letra ? "" : letra)}
                            >
                                {letra}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Aviso cuando el listado viene de los datos de ejemplo */}
            {aviso && <p className="legajos-aviso">{aviso}</p>}

            {/* Tabla de legajos */}
            <div className="legajos-table-wrap">
                <table className="legajos-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Código de Documento</th>
                            <th>Apellidos y Nombres</th>
                            <th>Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="empty-row">
                                    Cargando legajos...
                                </td>
                            </tr>
                        ) : filtrados.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="empty-row">
                                    No se encontraron legajos con ese criterio.
                                </td>
                            </tr>
                        ) : (
                            filtrados.map((empleado, idx) => (
                                <tr
                                    key={empleado.id ?? empleado.codigo}
                                    className="clickable-row"
                                    onClick={() => setEmpleadoSel(empleado)}
                                    title="Ver detalle del legajo"
                                >
                                    <td>{idx + 1}</td>
                                    <td>
                                        <span className="codigo-documento">{empleado.codigo}</span>
                                    </td>
                                    <td>{empleado.apellidosNombres}</td>
                                    <td>
                                        <span className={`badge estado-${empleado.activo ? "activo" : "inactivo"}`}>
                                            {empleado.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* La `key` remonta el modal al cambiar de empleado y reinicia su estado interno */}
            <ModalLegajo
                key={empleadoSel?.codigo ?? "sin-seleccion"}
                empleado={empleadoSel}
                onClose={() => setEmpleadoSel(null)}
            />
        </div>
    );
}