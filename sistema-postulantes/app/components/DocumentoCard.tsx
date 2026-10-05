import type { Props } from "../types/props"

const FICHA_ID = 1

export default function DocumentoCard({ id, nombre, requerido, extensionesPermitidas, tamanoMaximoBytes, archivo, error, subiendo , onArchivo, onAbrirFicha} : Props){
 
    const esFicha = id === FICHA_ID

    const estado = esFicha
            ? "Completa tu información y guarda los cambios."
            : archivo
                ? `Adjuntado: ${archivo}`
                : "Sin adjuntar"

    const btnBase = "shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
    const btnColor = archivo && !esFicha ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
    const accept = extensionesPermitidas ?? ".pdf";
    const maxMb = tamanoMaximoBytes ? `${(tamanoMaximoBytes / 1024 / 1024).toFixed(tamanoMaximoBytes >= 10000000 ? 0 : 1)} MB` : null;

    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{id}</span>
                <span className="text-sm font-medium text-slate-700">{nombre}</span>
                {!esFicha && typeof requerido === "boolean" && (
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${requerido ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"}`}>
                    {requerido ? "Obligatorio" : "Opcional"}
                  </span>
                )}
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">{estado}</p>
                {!esFicha && (accept || maxMb) && (
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {accept}{maxMb ? ` • Máx ${maxMb}` : ""}
                  </p>
                )}
                {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            {esFicha ? (
                <button type="button" onClick={onAbrirFicha} className={`${btnBase} ${btnColor}`}>
                Rellenar ficha
                </button>
            ) : (
                <label className={`${btnBase} ${btnColor} focus-within:ring-2 focus-within:ring-blue-300 ${
                        subiendo ? "pointer-events-none opacity-60" : "" }`} aria-disabled={subiendo}>
                { subiendo ? "...Subiendo" : archivo ? "Cambiar" : `Adjuntar ${accept}`}
                <input
                    type="file"
                    accept={accept}
                    className="sr-only"
                    disabled={subiendo}
                    onChange={(e) => {
                        onArchivo(id, e.target.files?.[0])
                        e.target.value = ""
                    }}
                />
                </label>
            )}
        </div>
    )
}