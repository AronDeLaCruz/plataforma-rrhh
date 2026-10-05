export type Props = {
    id:number,
    nombre: string
    requerido?: boolean
    extensionesPermitidas?: string
    tamanoMaximoBytes?: number
    archivo?: string
    error?: string
    subiendo?: boolean,
    onArchivo: (id: number, file?: File) => void
    onAbrirFicha: () => void
}