export type Props = {
    id:number,
    nombre: string
    archivo?: string
    error?: string
    subiendo?: boolean,
    onArchivo: (id: number, file?: File) => void
    onAbrirFicha: () => void
}