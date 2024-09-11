import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { ClientType, iClient } from "../types/iClient"
import { Service } from "../services/services"

interface iProps {
    id: string
    handleCloseModal: () => void
}

export const ClientForm: React.FC<iProps> = ({ id, handleCloseModal }) => {
    const [newClient, setNewClient] = useState<iClient>({
        id: 0,
        name: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: '',
        type: ClientType.PRIVADO,
        nit: ''
    })

    useEffect(() => {
        if (id === 'new') {
            setNewClient({
                id: 0,
                name: '',
                address: '',
                phone: '',
                email: '',
                contactPerson: '',
                type: ClientType.PRIVADO,
                nit: ''
            })
        } else {
            id && Service.client().getOne(+id).then((res) => {
                setNewClient(res)
            })
        }
    }, [id])

    const saveClient = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (newClient.name === '') {
            Swal.fire('Error', 'Por favor rellene todos los campos', 'error')
        } else {
            Service.client().post(newClient).then((res) => {
                if (res.statusCode === 500) {
                    Swal
                        .fire('Error', res.statusCode === 500 ? "Ya existe un Cliente con ese nombre" : 'Ocurrio un error', 'error')
                } else {
                    Swal
                        .fire('Guardado', 'Cliente guardado correctamente', 'success')
                        .then(() => {
                            handleCloseModal()
                        })
                }
            })
        }
    }

    return (
        <div className="container">
            <form className="box" onSubmit={saveClient}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>

                    <input className="form-control" value={newClient?.name} onChange={(e) => {
                        const { value } = e.target as HTMLInputElement
                        setNewClient({ ...newClient, name: value })
                    }} type="text" placeholder="Name" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>

                    <input className="form-control" value={newClient?.address} onChange={(e) => {
                        const { value } = e.target as HTMLInputElement
                        setNewClient({ ...newClient, address: value })
                    }} type="text" placeholder="Address" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Teléfono</label>

                    <input className="form-control" value={newClient?.phone} onChange={(e) => {
                        const { value } = e.target as HTMLInputElement
                        setNewClient({ ...newClient, phone: value })
                    }} type="text" placeholder="Phone" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Correo</label>

                    <input className="form-control" value={newClient?.email} onChange={(e) => {
                        const { value } = e.target as HTMLInputElement
                        setNewClient({ ...newClient, email: value })
                    }} type="text" placeholder="Email" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contacto</label>

                    <input className="form-control" value={newClient?.contactPerson} onChange={(e) => {
                        const { value } = e.target as HTMLInputElement
                        setNewClient({ ...newClient, contactPerson: value })
                    }} type="text" placeholder="Contact Person" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <select className="form-select" value={newClient?.type} onChange={(e) => {
                        const { value } = e.target as HTMLSelectElement
                        setNewClient({ ...newClient, type: value as ClientType })
                    }}>
                        <option value={ClientType.PRIVADO}>Privado</option>
                        <option value={ClientType.PUBLICO}>Público</option>
                    </select>
                </div>

                <div className="mb-3 d-flex">
                    <button className="btn btn-info w-100 me-2" type="submit">Guardar</button>
                    <button className="btn btn-danger w-100" onClick={handleCloseModal} type="button">Cancelar</button>
                </div>
            </form>
        </div>
    )
}