import { useEffect } from "react";
import "./App.css";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { useAuthStore } from "./store/authStore";

function App() {
  const init = useAuthStore((s) => s.init);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    init();
  }, [init]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}

export default App;
