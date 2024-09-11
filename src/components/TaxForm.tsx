import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { iTax } from "../types/iTax"
import { Service } from "../services/services"

interface iProps {
    id: string
    handleCloseModal: () => void
}

export const TaxForm: React.FC<iProps> = ({ id, handleCloseModal }) => {
    const [newTax, setNewTax] = useState<iTax>({
        id: 0,
        name: '',
        value: 0
    })

    useEffect(() => {
        if (id === 'new') {
            setNewTax({ id: 0, name: '', value: 0 })
        } else {
            id && Service.tax().getOne(+id).then((res) => {
                setNewTax(res)
            })
        }
    }, [id])

    const saveTax = async () => {
        if (newTax.name === '' || newTax.value === 0) {
            Swal.fire('Error', 'Por favor rellene todos los campos', 'error')
        } else {
            await Service.tax().post(newTax).then((res) => {
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

    const updateTax = () => {
        if (newTax.name === '' || newTax.value === 0) {
            Swal.fire('Error', 'Por favor rellene todos los campos', 'error')
        } else {
            Service.tax().patch(newTax.id, newTax).then((res) => {
                if (res.statusCode === 500) {
                    Swal
                        .fire('Error', res.statusCode === 500 ? "Ya existe un impuesto con ese nombre" : 'Ocurrio un error', 'error')
                } else {
                    Swal
                        .fire('Guardado', 'Impuesto guardado correctamente', 'success')
                }
            })
        }

        handleCloseModal()
    }

    return (
        <div className="container">
            <div className="box">
                <h1 className="title is-4">{newTax?.id ? 'Editar Impuesto' : 'Nuevo Impuesto'}</h1>

                <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control">
                        <input className="form-control" value={newTax?.name} onChange={(e) => {
                            const { value } = e.target as HTMLInputElement
                            setNewTax({ ...newTax, name: value })
                        }} type="text" placeholder="Name" />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Porcentaje (%)</label>
                    <div className="control">
                        <input className="form-control" value={newTax?.value} onChange={(e) => {
                            const { value } = e.target as HTMLInputElement
                            setNewTax({ ...newTax, value: Number(value) })
                        }} type="number" step="0.01" min="0" max="100" placeholder="Value" />
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button className="btn btn-info" onClick={newTax?.id ? updateTax : saveTax}>Guardar</button>
                    </div>
                    <div className="control">
                        <button className="btn is-light" onClick={handleCloseModal}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}