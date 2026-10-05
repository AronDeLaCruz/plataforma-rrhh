import { puestoService, postulacionService } from "@/services/api";
import type { Puesto } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

interface ModalPostulanteProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (nuevoPostulante: { nombre: string; dni: string; puesto: string; estado: string }) => void;
    puestos: string[];
}

export default function ModalPostulante({ isOpen, onClose, onSave, puestos }: ModalPostulanteProps) {
    const [saving, setSaving] = useState(false);
    const [puestosList, setPuestosList] = useState<Puesto[]>([]);
    const [cargados, setCargados] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: "",
        dni: "",
        tipoDocumento: "1",
        puesto: "",
        estado: "Pendiente",
        email: "",
        telefono: ""
    });

    useEffect(() => {
        if (!isOpen) return;
        let cancelado = false;

        const cargarPuestos = async () => {
            try {
                const data: unknown = await puestoService.listado();
                if (cancelado || !Array.isArray(data)) return;

                const lista = data as Puesto[];
                setPuestosList(lista);
                if (lista.length > 0) {
                    setFormData(prev => ({ ...prev, puesto: prev.puesto || String(lista[0].id) }));
                }
            } catch (err) {
                if (!cancelado) console.error("Error al obtener puestos:", err);
            } finally {
                if (!cancelado) setCargados(true);
            }
        };

        void cargarPuestos();

        return () => {
            cancelado = true;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nombre.trim() || !formData.dni.trim() || !formData.puesto) return;

        try {
            setSaving(true);
            setError(null);

            await postulacionService.crear({
                nombre: formData.nombre.trim(),
                apellido: "",
                tipoDocumento: formData.tipoDocumento,
                numeroDocumento: formData.dni.trim(),
                idPuesto: formData.puesto,
                estado: formData.estado,
                email: formData.email,
                telefono: formData.telefono.trim()
            });

            // El <select> siempre devuelve string: se compara normalizado con el id del puesto.
            const selectedPuestoObj = puestosList.find(p => String(p.id) === formData.puesto);
            const puestoNombre = selectedPuestoObj ? selectedPuestoObj.titulo : formData.puesto;

            onSave({
                ...formData,
                puesto: puestoNombre
            });

            setFormData({
                nombre: "",
                dni: "",
                tipoDocumento: "1",
                puesto: puestosList.length > 0 ? String(puestosList[0].id) : (puestos[0] || ""),
                estado: "Pendiente",
                email: "",
                telefono: ""
            });
            onClose();
        } catch (err: unknown) {
            console.error("Error al crear la postulacion:", err);
            const mensaje = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
            setError(mensaje || "Ocurrió un error al guardar la postulación en el servidor.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Nuevo Postulante</h3>
                {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombres</label>
                        <input 
                            type="text" 
                            id="nombre" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="tipoDocumento">Tipo de Documento</label>
                        <select name="tipoDocumento" id="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}>
                            <option value="">Seleccionar</option>
                            <option value="1">DNI</option>
                            <option value="2">Carnet De Extranjeria</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dni">DNI</label>
                        <input type="text" id="dni" name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="puesto">Puesto</label>
                        <select id="puesto" name="puesto" value={formData.puesto} onChange={handleChange} required disabled={saving}>
                            <option value="">Seleccionar Cargo</option>
                            {!cargados ? (
                                <option value="">Cargando puestos...</option>
                            ) : puestosList.length > 0 ? (
                                puestosList.map(p => <option key={p.id} value={String(p.id)}>{p.titulo}</option>)
                            ) : (
                                puestos.map(p => <option key={p} value={p}>{p}</option>)
                            )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="estado">Estado</label>
                        <select 
                            id="estado" 
                            name="estado" 
                            value={formData.estado} 
                            onChange={handleChange}
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Entrevista">Entrevista</option>
                            <option value="Rechazado">Rechazado</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={onClose} disabled={saving}>
                            Cancelar
                        </button>
                        <button type="submit" className="save-button" disabled={saving}>
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
