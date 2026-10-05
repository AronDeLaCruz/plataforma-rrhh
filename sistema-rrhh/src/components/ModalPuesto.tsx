import { useState } from "react";
import axios from "axios";
import { puestoService } from "../services/api";

interface ModalPuestoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (nombrePuesto: string) => void;
}

export default function ModalPuesto({ isOpen, onClose, onSave }: ModalPuestoProps) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [requerimiento, setRequerimiento] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        try {
            setLoading(true);
            setError(null);

            await puestoService.crear({
                titulo: nombre.trim(),
                descripcion: descripcion.trim(),
                requerimiento: requerimiento.trim(),
                departamento: "",
                modalidad: ""
            });

            onSave(nombre.trim());
            setNombre("");
            setDescripcion("");
            setRequerimiento("");
            onClose();

        } catch (err: unknown) {
            console.error("Error al crear el puesto:", err);
            const mensaje = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
            setError(mensaje || "Ocurrió un error al guardar el puesto en el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Nuevo Puesto</h3>
                {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombrePuesto">Nombre del Puesto</label>
                        <input 
                            type="text" 
                            id="nombrePuesto" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            placeholder="Ej: Desarrollador Backend"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcionPuesto">Descripcion</label>
                        <input 
                            type="text" 
                            id="descripcionPuesto"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="requerimientoPuesto">Requerimiento</label>
                        <input 
                            type="text" 
                            id="requerimientoPuesto"
                            value={requerimiento}
                            onChange={(e) => setRequerimiento(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="save-button" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Puesto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

