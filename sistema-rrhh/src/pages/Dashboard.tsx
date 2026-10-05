import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Postulantes from "@/components/Postulantes";
import "./Dashboard.css";
import Legajos from "@/components/Legajos";
import Configuracion from "@/components/Configuracion";

type View = "inicio" | "postulantes" | "legajo" | "configuracion";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("inicio");
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const renderContent = () => {
    switch (currentView) {
      case "postulantes":
        return <Postulantes />;
      case "legajo":
        return <Legajos/>;
      case "configuracion":
        return <Configuracion/>;
      default:
        return (
          <>
            <header>
              <h1>Panel de Control</h1>
            </header>
            <section className="user-info">
              <p>Bienvenido, <strong>{user?.nombre ?? "Usuario"}</strong></p>
              <p>Email: <span>{user?.email}</span></p>
              <p>Rol: <span className="badge">{user?.rol}</span></p>
              <p>Alias: <em>bananon</em></p>
            </section>
            <section style={{ marginTop: "20px" }}>
              <p>Selecciona una opción del menú lateral para comenzar a trabajar.</p>
            </section>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>RRHH</h2>
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={currentView === "inicio" ? "active" : ""} 
              onClick={() => setCurrentView("inicio")}
            >
              Inicio
            </li>
            <li 
              className={currentView === "postulantes" ? "active" : ""} 
              onClick={() => setCurrentView("postulantes")}
            >
              Postulantes
            </li>
            <li 
              className={currentView === "legajo" ? "active" : ""} 
              onClick={() => setCurrentView("legajo")}
            >
              Legajo
            </li>
            <li 
              className={currentView === "configuracion" ? "active" : ""} 
              onClick={() => setCurrentView("configuracion")}
            >
              Configuración
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="logout-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
