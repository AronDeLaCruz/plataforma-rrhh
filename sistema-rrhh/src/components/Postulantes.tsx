import { useEffect, useState } from "react";
import "./Postulantes.css";
import ModalPostulante from "./ModalPostulante";
import ModalPuesto from "./ModalPuesto";
import ModalFichaPostulante from "./ModalFichaPostulante";
import { postulacionService } from "@/services/api";
import type { Postulante } from "@/types";

export default function Postulantes() {
    const [puestos, setPuestos] = useState(["Desarrollador Frontend", "Analista RRHH", "QA Engineer"]);
    const [postulantes, setPostulantes] = useState<Postulante[]>([]);
    const [isPostulanteModalOpen, setIsPostulanteModalOpen] = useState(false);
    const [isPuestoModalOpen, setIsPuestoModalOpen] = useState(false);
    const [postulanteSel, setPostulanteSel] = useState<Postulante | null>(null);
    const [loading, setLoading] = useState(true);

   
    useEffect(() => {
        let cancelado = false;

        const cargarPostulantes = async () => {
            try {
                const data: unknown = await postulacionService.obtener();
                if (cancelado) return;
                if (Array.isArray(data)) {
                    setPostulantes(data as Postulante[]);
                }
            } catch (error) {
                if (!cancelado) console.error("Error al obtener postulaciones:", error);
            } finally {
                if (!cancelado) setLoading(false);
            }
        };

        void cargarPostulantes();

        return () => {
            cancelado = true;
        };
    }, []);


    const handleSavePostulante = (nuevoPostulante: { nombre: string; dni: string; puesto: string; estado: string }) => {
        // Los ids pueden venir como string desde la API: se normalizan antes de calcular el siguiente.
        const ids = postulantes.map((p) => Number(p.id)).filter((id) => !Number.isNaN(id));
        const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        setPostulantes([...postulantes, { id: newId, ...nuevoPostulante }]);
        setIsPostulanteModalOpen(false);
    };

    const handleSavePuesto = (nuevoPuesto: string) => {
        setPuestos([...puestos, nuevoPuesto]);
        setIsPuestoModalOpen(false);
    };

    return (
        <div className="postulantes-view">
            <div className="postulantes-header">
                <div>
                    <h2>Gestión de Postulantes</h2>
                    <p>Aquí puedes ver y gestionar las candidaturas actuales.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="create-button" onClick={() => setIsPuestoModalOpen(true)}>
                        + Crear Puesto
                    </button>
                    <button className="create-button" onClick={() => setIsPostulanteModalOpen(true)}>
                        + Crear Postulante
                    </button>
                </div>
            </div>
            
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px' }}>Nombre</th>
                    <th style={{ padding: '10px' }}>DNI</th>
                    <th style={{ padding: '10px' }}>Puesto</th>
                    <th style={{ padding: '10px' }}>Codigo</th>
                    <th style={{ padding: '10px' }}>Estado</th>
                    <th style={{ padding: '10px' }}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={6} style={{ padding: '10px', textAlign: 'center' }}>Cargando postulaciones...</td>
                    </tr>
                ) : postulantes.length === 0 ? (
                    <tr>
                        <td colSpan={6} style={{ padding: '10px', textAlign: 'center' }}>No hay postulaciones registradas.</td>
                    </tr>
                ) : (
                    postulantes.map((p) => {
                        const nombre = p.nombreCompleto ?? p.nombre ?? "-";
                        const documento = p.dni ?? p.numeroDocumento ?? "-";
                        const puesto = p.puesto ?? p.puestoNombre ?? "-";
                        const estado = p.estado ?? "Pendiente";
                        return (
                            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{nombre}</td>
                                <td style={{ padding: '10px' }}>{documento}</td>
                                <td style={{ padding: '10px' }}>{puesto}</td>
                                <td style={{ padding: '10px' }}>{p.codigo ?? p.id}</td>
                                <td style={{ padding: '10px' }}>
                                    <span className={`badge state-${estado.toLowerCase()}`}>{estado}</span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button
                                        type="button"
                                        className="ficha-button"
                                        onClick={() => setPostulanteSel(p)}
                                        title="Ver ficha del postulante"
                                    >
                                        Ficha
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>

            <ModalPostulante
                isOpen={isPostulanteModalOpen} 
                onClose={() => setIsPostulanteModalOpen(false)} 
                onSave={handleSavePostulante} 
                puestos={puestos}
            />

            <ModalPuesto 
                isOpen={isPuestoModalOpen} 
                onClose={() => setIsPuestoModalOpen(false)} 
                onSave={handleSavePuesto} 
            />

            {/* La `key` remonta el modal al cambiar de postulante y reinicia su estado interno */}
            <ModalFichaPostulante
                key={postulanteSel ? String(postulanteSel.id) : "sin-seleccion"}
                postulante={postulanteSel}
                onClose={() => setPostulanteSel(null)}
            />
        </div>
    );
}
