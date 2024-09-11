import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { iProductType } from "../types/iProductType"
import { Service } from "../services/services"

interface iProps {
    id: string
    handleCloseModal: () => void
}

export const ProductTypeForm: React.FC<iProps> = ({ id, handleCloseModal }) => {
    const [newProductType, setNewProductType] = useState<iProductType>({
        id: 0,
        name: ''
    })

    useEffect(() => {
        if (id === 'new') {
            setNewProductType({ id: 0, name: '' })
        } else {
            id && Service.productType().getOne(+id).then((res) => {
                setNewProductType(res)
            })
        }
    }, [id])

    const saveProductType = () => {
        if (newProductType.name === '') {
            Swal.fire('Error', 'Por favor rellene todos los campos', 'error')
        } else {
            Service.productType().post(newProductType).then((res) => {
                if (res.statusCode === 500) {
                    Swal
                        .fire('Error', res.statusCode === 500 ? "Ya existe un tipo de producto con ese nombre" : 'Ocurrio un error', 'error')
                } else {
                    Swal
                        .fire('Guardado', 'Tipo de producto guardado correctamente', 'success')
                }

                handleCloseModal()
            })
        }
    }

    return (
        <div className="container">
            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input className="form-control" value={newProductType?.name} onChange={(e) => {
                    const { value } = e.target as HTMLInputElement
                    setNewProductType({ ...newProductType, name: value })
                }} type="text" placeholder="Name" />
            </div>

            <div className="mb-3 d-flex">
                <button className="btn btn-info me-2 w-100" onClick={saveProductType}>Guardar</button>
                <button className="btn btn-danger w-100" onClick={handleCloseModal}>Cancelar</button>
            </div>
        </div>
    )
}