import { useEffect, useMemo, useState, type FormEvent } from "react";
import "./Configuracion.css";
import "./Postulantes.css";
import { ID_FICHA_PERSONAL } from "@/constants/documentos";
import { tipoDocumentoService, usuarioService } from "@/services/api";
import type { DocumentoTipo, UsuarioApi } from "@/types";
import { useAuthStore } from "@/store/authStore";

export type Rol = "Admin" | "RRHH" | "Lector";
export type Tab = "accesos" | "documentos";

export interface UsuarioConfig {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
}

export interface TipoDocumentoConfig {
  id: number;
  nombre: string;
  obligatorio: boolean;
  formatos: string[];
  maxMB: number;
  activo: boolean;
  sistema: boolean;
}

export const ROLES: Rol[] = ["Admin", "RRHH", "Lector"];

/** Roles permitidos al crear un usuario desde Configuración. */
export const ROLES_CREACION: Rol[] = ["Admin", "RRHH"];

/** Payload para POST /Usuario */
export interface NuevoUsuarioPayload {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

/** Normaliza el rol del backend al union local (desconocido -> Lector). */
function normalizarRol(rol: string): Rol {
  const r = (rol ?? "").trim().toLowerCase();
  if (r === "admin" || r === "administrador") return "Admin";
  if (r === "rrhh" || r === "recursos humanos" || r === "rh") return "RRHH";
  return "Lector";
}

/** Adapta el DTO del backend (GET /Usuario) a la vista de Configuración. */
function adaptarUsuario(u: UsuarioApi): UsuarioConfig {
  return {
    id: String(u.id),
    nombre: u.nombre ?? "-",
    email: u.email ?? "-",
    rol: normalizarRol(u.rol),
    activo: u.activo ?? true,
  };
}

/** ".pdf,.jpg,.png" -> ["PDF","JPG","PNG"] */
function parseExtensiones(ext: string | undefined): string[] {
  if (!ext) return [];
  return ext.split(",").map((e) => e.trim().replace(/^\./, "").toUpperCase()).filter(Boolean);
}

/** bytes -> MB con 1 decimal (10_000_000 -> 10, 5_000_000 -> 5) */
function bytesAMB(bytes: number | undefined): number {
  if (!bytes || bytes <= 0) return 0;
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

/** Adapta el DTO del backend (GET /TipoDocumento) a la vista de Configuración. */
function adaptarTipo(d: DocumentoTipo): TipoDocumentoConfig {
  const esSistema = Number(d.id) === ID_FICHA_PERSONAL;
  return {
    id: Number(d.id),
    nombre: d.nombre,
    obligatorio: d.requerido ?? false,
    formatos: parseExtensiones(d.extensionesPermitidas),
    maxMB: bytesAMB(d.tamanoMaximoBytes),
    activo: d.activo ?? true,
    sistema: esSistema,
  };
}

function rolBadgeClass(rol: Rol): string {
  if (rol === "Admin") return "badge-rol badge-rol-admin";
  if (rol === "RRHH") return "badge-rol badge-rol-rrhh";
  return "badge-rol badge-rol-lector";
}

export default function Configuracion() {
  const rolActual = useAuthStore((s) => s.user?.rol ?? "");
  const esAdmin = rolActual.toLowerCase() === "admin";
  const [tab, setTab] = useState<Tab>("accesos");

  const [usuarios, setUsuarios] = useState<UsuarioConfig[]>([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [usuarioModal, setUsuarioModal] = useState<null | { modo: "crear" | "editar"; usuario: UsuarioConfig }>(null);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);

  const cargarUsuarios = async () => {
    setCargandoUsuarios(true);
    setErrorUsuarios(null);
    try {
      const data = await usuarioService.listado();
      setUsuarios(data.map(adaptarUsuario));
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setErrorUsuarios("No se pudieron cargar los usuarios. Revisa la conexión e inténtalo de nuevo.");
    } finally {
      setCargandoUsuarios(false);
    }
  };

  useEffect(() => {
    let cancelado = false;
    const cargar = async () => {
      try {
        const data = await usuarioService.listado();
        if (!cancelado) setUsuarios(data.map(adaptarUsuario));
      } catch (error) {
        if (!cancelado) {
          console.error("Error al obtener usuarios:", error);
          setErrorUsuarios("No se pudieron cargar los usuarios. Revisa la conexión e inténtalo de nuevo.");
        }
      } finally {
        if (!cancelado) setCargandoUsuarios(false);
      }
    };
    setCargandoUsuarios(true);
    setErrorUsuarios(null);
    void cargar();
    return () => { cancelado = true; };
  }, []);

  const [tipos, setTipos] = useState<TipoDocumentoConfig[]>([]);
  const [busquedaTipo, setBusquedaTipo] = useState("");
  const [tipoModal, setTipoModal] = useState<null | { modo: "crear" | "editar"; tipo: TipoDocumentoConfig }>(null);
  const [cargandoTipos, setCargandoTipos] = useState(true);
  const [errorTipos, setErrorTipos] = useState<string | null>(null);

  const cargarTipos = async () => {
    setCargandoTipos(true);
    setErrorTipos(null);
    try {
      const data = await tipoDocumentoService.listado();
      setTipos(data.map(adaptarTipo));
    } catch (error) {
      console.error("Error al obtener tipos de documento:", error);
      setErrorTipos("No se pudieron cargar los tipos de documento. Revisa la conexión e inténtalo de nuevo.");
    } finally {
      setCargandoTipos(false);
    }
  };

  useEffect(() => {
    let cancelado = false;
    const cargar = async () => {
      setCargandoTipos(true);
      setErrorTipos(null);
      try {
        const data = await tipoDocumentoService.listado();
        if (!cancelado) setTipos(data.map(adaptarTipo));
      } catch (error) {
        if (!cancelado) {
          console.error("Error al obtener tipos de documento:", error);
          setErrorTipos("No se pudieron cargar los tipos de documento. Revisa la conexión e inténtalo de nuevo.");
        }
      } finally {
        if (!cancelado) setCargandoTipos(false);
      }
    };
    void cargar();
    return () => { cancelado = true; };
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const q = busquedaUsuario.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) =>
      u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.rol.toLowerCase().includes(q),
    );
  }, [usuarios, busquedaUsuario]);

  const tiposFiltrados = useMemo(() => {
    const q = busquedaTipo.trim().toLowerCase();
    if (!q) return tipos;
    return tipos.filter((t) => t.nombre.toLowerCase().includes(q));
  }, [tipos, busquedaTipo]);

  const guardarUsuario = async (datos: UsuarioConfig, password?: string) => {
    if (usuarioModal?.modo === "crear") {
      if (usuarios.some((u) => u.email.toLowerCase() === datos.email.toLowerCase())) {
        alert("Ya existe un usuario con ese email.");
        return;
      }
      if (!password || password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      try {
        const creado = await usuarioService.crear({
          nombre: datos.nombre,
          email: datos.email,
          password,
          rol: datos.rol,
        });
        setUsuarios([...usuarios, adaptarUsuario(creado)]);
      } catch (error) {
        console.error("Error al crear usuario:", error);
        alert("No se pudo crear el usuario. Revisa los datos e inténtalo de nuevo.");
        return;
      }
    } else {
      setUsuarios(usuarios.map((u) => (u.id === datos.id ? datos : u)));
    }
    setUsuarioModal(null);
  };

  const toggleActivoUsuario = async (id: string) => {
    const u = usuarios.find((x) => x.id === id);
    if (!u) return;
    const nuevoEstado = !u.activo;
    if (!confirm(`${u.activo ? "Desactivar" : "Activar"} el acceso de ${u.nombre}?`)) return;
    // Optimista: se revierte si el backend falla.
    setUsuarios(usuarios.map((x) => (x.id === id ? { ...x, activo: nuevoEstado } : x)));
    try {
      const actualizado = await usuarioService.estado(id, nuevoEstado);
      setUsuarios((prev) =>
        prev.map((x) => (x.id === id ? adaptarUsuario(actualizado) : x)),
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      setUsuarios((prev) => prev.map((x) => (x.id === id ? u : x)));
      alert("No se pudo cambiar el estado. Inténtalo de nuevo.");
    }
  };

  const resetPassword = (u: UsuarioConfig) => {
    alert(`Se envio un enlace de restablecimiento a ${u.email} (mockup).`);
  };

  const guardarTipo = (datos: TipoDocumentoConfig) => {
    if (tipos.some((t) => t.id !== datos.id && t.nombre.toLowerCase() === datos.nombre.toLowerCase())) {
      alert("Ya existe un tipo de documento con ese nombre.");
      return;
    }
    if (tipoModal?.modo === "crear") {
      const ids = tipos.map((t) => t.id);
      const nuevoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
      setTipos([...tipos, { ...datos, id: nuevoId, sistema: false }]);
    } else {
      setTipos(tipos.map((t) => (t.id === datos.id ? datos : t)));
    }
    setTipoModal(null);
  };

  const toggleObligatorio = (id: number) => {
    setTipos(tipos.map((t) => (t.id === id ? { ...t, obligatorio: !t.obligatorio } : t)));
  };

  const toggleActivoTipo = (id: number) => {
    const t = tipos.find((x) => x.id === id);
    if (!t || t.sistema) return;
    if (!confirm(`${t.activo ? "Desactivar" : "Activar"} el tipo "${t.nombre}"?`)) return;
    setTipos(tipos.map((x) => (x.id === id ? { ...x, activo: !x.activo } : x)));
  };

  const moverTipo = (id: number, dir: -1 | 1) => {
    const idx = tipos.findIndex((t) => t.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= tipos.length) return;
    const copia = [...tipos];
    const tmp = copia[idx];
    copia[idx] = copia[j];
    copia[j] = tmp;
    setTipos(copia);
  };

  const nuevoTipoVacio: TipoDocumentoConfig = {
    id: 0, nombre: "", obligatorio: true, formatos: ["PDF"], maxMB: 5, activo: true, sistema: false,
  };
  return (
    <div className="config-view">
      <div className="config-header">
        <div>
          <h2>Configuración</h2>
          <p>Accesos de usuarios y tipos de documentos.</p>
        </div>
      </div>
      {!esAdmin && (<p className="config-aviso">Solo lectura (rol: {rolActual || "-"}).</p>)}
      <div className="config-tabs" role="tablist">
        <button type="button" className={tab === "accesos" ? "config-tab active" : "config-tab"} onClick={() => setTab("accesos")}>Accesos ({usuarios.length})</button>
        <button type="button" className={tab === "documentos" ? "config-tab active" : "config-tab"} onClick={() => setTab("documentos")}>Documentos ({tipos.length})</button>
      </div>
      {tab === "accesos" ? (
        <>
          <div className="config-toolbar">
            <input className="config-search" placeholder="Buscar por nombre, email o rol..."
              value={busquedaUsuario} onChange={(e) => setBusquedaUsuario(e.target.value)} />
            <button type="button" className="create-button" disabled={!esAdmin}
              onClick={() => setUsuarioModal({ modo: "crear", usuario: { id: "", nombre: "", email: "", rol: "Lector", activo: true } })}>
              + Nuevo usuario
            </button>
          </div>
          {errorUsuarios && (
            <p className="config-aviso">
              {errorUsuarios}{" "}
              <button type="button" className="btn-sm" onClick={() => void cargarUsuarios()}>Reintentar</button>
            </p>
          )}
          <div className="config-table-wrap">
            <table className="config-table">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {cargandoUsuarios ? (
                  <tr><td colSpan={4} className="empty-row">Cargando usuarios...</td></tr>
                ) : usuariosFiltrados.length === 0 ? (
                  <tr><td colSpan={4} className="empty-row">Sin usuarios.</td></tr>
                ) : usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td><div className="config-user-cell"><strong>{u.nombre}</strong><small>{u.email}</small></div></td>
                    <td><span className={rolBadgeClass(u.rol)}>{u.rol}</span></td>
                    <td><span className={`badge-estado ${u.activo ? "activo" : "inactivo"}`}>{u.activo ? "Activo" : "Inactivo"}</span></td>
                    <td><div className="config-actions">
                      <button type="button" className="btn-sm" disabled={!esAdmin} onClick={() => setUsuarioModal({ modo: "editar", usuario: u })}>Editar</button>
                      <button type="button" className="btn-sm ghost" disabled={!esAdmin} onClick={() => resetPassword(u)}>Reset pass</button>
                      <button type="button" className="btn-sm danger" disabled={!esAdmin} onClick={() => void toggleActivoUsuario(u.id)}>{u.activo ? "Desactivar" : "Activar"}</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="config-hint">Admin: todo · RRHH: postulantes + legajos · Lector: solo lectura.</p>
        </>
      ) : (
        <>
          <div className="config-toolbar">
            <input className="config-search" placeholder="Buscar tipo..."
              value={busquedaTipo} onChange={(e) => setBusquedaTipo(e.target.value)} />
            <button type="button" className="create-button" disabled={!esAdmin}
              onClick={() => setTipoModal({ modo: "crear", tipo: nuevoTipoVacio })}>
              + Nuevo tipo
            </button>
          </div>
          {errorTipos && (
            <p className="config-aviso">
              {errorTipos}{" "}
              <button type="button" className="btn-sm" onClick={() => void cargarTipos()}>Reintentar</button>
            </p>
          )}
          <div className="config-table-wrap">
            <table className="config-table">
              <thead><tr><th>#</th><th>Nombre</th><th>Oblig.</th><th>Formatos</th><th>Max</th><th>Estado</th><th>Orden</th><th>Acciones</th></tr></thead>
              <tbody>
                {cargandoTipos ? (
                  <tr><td colSpan={8} className="empty-row">Cargando tipos de documento...</td></tr>
                ) : tiposFiltrados.length === 0 ? (
                  <tr><td colSpan={8} className="empty-row">Sin tipos.</td></tr>
                ) : tiposFiltrados.map((t) => (
                  <tr key={t.id}>
                    <td><span className="codigo-documento">{t.id}</span></td>
                    <td><div className="config-user-cell"><strong>{t.nombre}</strong>{t.sistema && <small>Sistema</small>}</div></td>
                    <td>{t.sistema ? "—" : (
                      <label className="switch"><input type="checkbox" checked={t.obligatorio} disabled={!esAdmin} onChange={() => toggleObligatorio(t.id)} /><span className="slider" /></label>
                    )}</td>
                    <td>{t.formatos.length === 0 ? "—" : t.formatos.map((f) => <span key={f} className="format-tag">{f}</span>)}</td>
                    <td>{t.sistema ? "—" : `${t.maxMB} MB`}</td>
                    <td>{t.sistema ? <span className="badge-estado sistema">Sistema</span> : <span className={`badge-estado ${t.activo ? "activo" : "inactivo"}`}>{t.activo ? "Activo" : "Inactivo"}</span>}</td>
                    <td><div className="config-actions">
                      <button type="button" className="order-btn" disabled={!esAdmin || tipos[0]?.id === t.id} onClick={() => moverTipo(t.id, -1)}>↑</button>
                      <button type="button" className="order-btn" disabled={!esAdmin || tipos[tipos.length - 1]?.id === t.id} onClick={() => moverTipo(t.id, 1)}>↓</button>
                    </div></td>
                    <td><div className="config-actions">
                      <button type="button" className="btn-sm" disabled={!esAdmin || t.sistema} onClick={() => setTipoModal({ modo: "editar", tipo: t })}>Editar</button>
                      {!t.sistema && (<button type="button" className="btn-sm danger" disabled={!esAdmin} onClick={() => toggleActivoTipo(t.id)}>{t.activo ? "Desactivar" : "Activar"}</button>)}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="config-hint">El tipo #1 es del sistema. El orden define el checklist.</p>
        </>
      )}
      {usuarioModal && (
        <UsuarioModal modo={usuarioModal.modo} inicial={usuarioModal.usuario}
          onClose={() => setUsuarioModal(null)} onSave={guardarUsuario} />
      )}
      {tipoModal && (
        <TipoModal modo={tipoModal.modo} inicial={tipoModal.tipo}
          onClose={() => setTipoModal(null)} onSave={guardarTipo} />
      )}
    </div>
  );
}

function UsuarioModal({ modo, inicial, onClose, onSave }: {
  modo: "crear" | "editar"; inicial: UsuarioConfig;
  onClose: () => void; onSave: (d: UsuarioConfig, password?: string) => void | Promise<void>;
}) {
  const [nombre, setNombre] = useState(inicial.nombre);
  const [email, setEmail] = useState(inicial.email);
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>(modo === "crear" ? "RRHH" : inicial.rol);
  const [enviando, setEnviando] = useState(false);
  const opcionesRol = modo === "crear" ? ROLES_CREACION : ROLES;
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) { alert("Completa nombre y email."); return; }
    if (modo === "crear" && password.length < 6) { alert("La contraseña debe tener al menos 6 caracteres."); return; }
    setEnviando(true);
    try {
      await onSave({ ...inicial, nombre: nombre.trim(), email: email.trim(), rol }, modo === "crear" ? password : undefined);
    } finally {
      setEnviando(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{modo === "crear" ? "Nuevo usuario" : "Editar acceso"}</h3>
        <form onSubmit={submit}>
          <div className="form-group"><label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div className="form-group"><label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          {modo === "crear" && (
            <div className="form-group"><label>Contraseña</label>
              <input type="password" value={password} minLength={6} autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                onChange={(e) => setPassword(e.target.value)} required /></div>
          )}
          <div className="form-group"><label>Rol</label>
            <select value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
              {opcionesRol.map((r) => <option key={r} value={r}>{r}</option>)}
            </select></div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={enviando}>Cancelar</button>
            <button type="submit" className="save-button" disabled={enviando}>{enviando ? "Guardando..." : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TipoModal({ modo, inicial, onClose, onSave }: {
  modo: "crear" | "editar"; inicial: TipoDocumentoConfig;
  onClose: () => void; onSave: (d: TipoDocumentoConfig) => void;
}) {
  const [nombre, setNombre] = useState(inicial.nombre);
  const [obligatorio, setObligatorio] = useState(inicial.obligatorio);
  const [formatos, setFormatos] = useState<string[]>(inicial.formatos);
  const [maxMB, setMaxMB] = useState(inicial.maxMB);
  const toggleFmt = (f: string) => {
    setFormatos((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) { alert("El nombre es obligatorio."); return; }
    if (formatos.length === 0) { alert("Elige al menos un formato."); return; }
    onSave({ ...inicial, nombre: nombre.trim(), obligatorio, formatos, maxMB });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{modo === "crear" ? "Nuevo tipo" : "Editar tipo"}</h3>
        <form onSubmit={submit}>
          <div className="form-group"><label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div className="form-group"><label>Obligatorio</label>
            <select value={obligatorio ? "si" : "no"} onChange={(e) => setObligatorio(e.target.value === "si")}>
              <option value="si">Si</option><option value="no">No</option>
            </select></div>
          <div className="form-group"><label>Formatos</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["PDF", "JPG", "PNG", "DOCX"].map((f) => (
                <label key={f} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <input type="checkbox" checked={formatos.includes(f)} onChange={() => toggleFmt(f)} />{f}
                </label>
              ))}
            </div></div>
          <div className="form-group"><label>Tamano max (MB)</label>
            <input type="number" min={1} max={50} value={maxMB}
              onChange={(e) => setMaxMB(Number(e.target.value))} /></div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
