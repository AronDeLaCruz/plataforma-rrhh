"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../store/authStore"
import "../css/login.css"

export default function Login() {
    const router = useRouter()
    const login = useAuthStore((state) => state.login)
    const [dni, setDni] = useState("")
    const [codigo, setCodigo] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (!dni.trim() || !codigo.trim()) {
            setError("Por favor completa todos los campos.")
            return
        }

        setLoading(true)
        try {
            // El store valida las credenciales fijas.
            const ok = await login(dni, codigo)
            if (ok) {
                router.push("/dashboard")
            } else {
                setError("DNI o código incorrectos.")
            }
        } catch (error) {
            console.log(error)
            setError("Problema al ingresar")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">Bienvenido</h1>
                    <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="login-field">
                        <label htmlFor="dni">DNI</label>
                        <input
                            id="dni"
                            name="dni"
                            type="text"
                            inputMode="numeric"
                            autoComplete="username"
                            placeholder="Ej. 12345678"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="codigo">Código de Acceso</label>
                        <input
                            id="codigo"
                            name="codigo"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Ingresa tu código"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Ingresando…" : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    )
}