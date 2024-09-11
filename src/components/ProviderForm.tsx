import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { iProvider } from "../types/iProvider"
import { Service } from "../services/services"

interface iProps {
    id: string
    handleCloseModal: () => void
}

export const ProviderForm: React.FC<iProps> = ({ id, handleCloseModal }) => {
    const [newProvider, setNewProvider] = useState<iProvider>({
        id: 0,
        name: '',
    })

    useEffect(() => {
        if (id === 'new') {
            setNewProvider({ id: 0, name: '' })
        } else {
            id && Service.provider().getOne(+id).then((res) => {
                setNewProvider(res)
            })
        }
    }, [id])

    const saveProvider = () => {
        if (newProvider.name === '') {
            Swal.fire('Error', 'Por favor rellene todos los campos', 'error')
        } else {
            Service.provider().post(newProvider).then((res) => {
                if (res.statusCode === 500) {
                    Swal
                        .fire('Error', res.statusCode === 500 ? "Ya existe un impuesto con ese nombre" : 'Ocurrio un error', 'error')
                } else {
                    Swal
                        .fire('Guardado', 'Impuesto guardado correctamente', 'success')
                }
            })

            handleCloseModal()
        }
    }

    return (
        <div className="container">
            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input className="form-control" value={newProvider?.name} onChange={(e) => {
                    const { value } = e.target as HTMLInputElement
                    setNewProvider({ ...newProvider, name: value })
                }} type="text" placeholder="Name" />
            </div>

            <div className="d-flex">
                <button className="btn btn-info me-2 w-100" onClick={saveProvider}>Guardar</button>
                <button className="btn btn-danger w-100" onClick={handleCloseModal}>Cancelar</button>
            </div>
        </div>
    )
}