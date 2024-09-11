import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { iProduct } from "../types/iProduct"
import { Service } from "../services/services"
import { iProductType } from "../types/iProductType"
import { iProvider } from "../types/iProvider"
import { SelectInput } from "./core/SelectInput"

interface iProps {
    id: string
    handleCloseModal: () => void
}

export const ProductForm: React.FC<iProps> = ({ id, handleCloseModal }) => {
    const [productTypes, setProductTypes] = useState<iProductType[]>()
    const [providers, setProviders] = useState<iProvider[]>([])
    const [newProduct, setNewProduct] = useState<iProduct>({
        id: 0,
        name: '',
        price: 0,
        code: '',
        description: '',
        providerId: 0,
        productType: {
            id: 0,
            name: ''
        },
        quantity: 0
    })

    useEffect(() => {
        const get = async () => {
            await Service.productType().get().then((res) => setProductTypes(res))
            await Service.provider().get().then((res) => setProviders(res))

            if (id === 'new') {
                setNewProduct({
                    id: 0,
                    name: '',
                    price: 0,
                    code: '',
                    description: '',
                    providerId: 0,
                    productType: {
                        id: 0,
                        name: ''
                    },
                    quantity: 0
                })
            } else {
                await Service.product().getOne(+id).then((res) => {
                    const products = {
                        ...res,
                        productTypeId: res.productType?.id ?? 0,
                        providerId: res.provider?.id ?? 0
                    }
                    setNewProduct(products)
                })
            }
        }

        get()
    }, [id])

    useEffect(() => {
        setNewProduct({
            ...newProduct,
            description: newProduct.code + ' - ' + newProduct.name
        })
    }, [newProduct.name, newProduct.code])

    const saveProduct = async () => {
        if (newProduct.name === '') {
            Swal.fire('Error', 'Por favor rellene todos los campos', 'error')
        } else {
            await Service.product().post(newProduct).then((res) => {
                if (res.statusCode === 500) {
                    Swal
                        .fire('Error', res.statusCode === 500 ? "Ya existe un Producto con ese nombre" : 'Ocurrio un error', 'error')
                } else {
                    Swal
                        .fire('Guardado', 'Producto guardado correctamente', 'success')
                }

                handleCloseModal()
            })
        }
    }

    return (
        <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="mb-3">
                            <label className="label">Nombre</label>
                            <div className="control">
                                <input className="form-control" value={newProduct?.name} onChange={(e) => {
                                    const { value } = e.target as HTMLInputElement
                                    setNewProduct({ ...newProduct, name: value })
                                }} type="text" placeholder="Name" />
                            </div>

                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-3">
                            <label className="label">Código</label>
                            <div className="control">
                                <input className="form-control" value={newProduct?.code} onChange={(e) => {
                                    const { value } = e.target as HTMLInputElement
                                    setNewProduct({ ...newProduct, code: value })
                                }} type="text" placeholder="Code" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="mb-3">
                            <label className="label">Descripción</label>
                            <div className="control">
                                <textarea
                                    name=""
                                    id=""
                                    className="form-control"
                                    onChange={(e) => {
                                        const { value } = e.target as HTMLTextAreaElement
                                        setNewProduct({ ...newProduct, description: value })
                                    }}
                                    disabled
                                    value={newProduct?.description}
                                >
                                </textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="mb-3">
                            <label className="label">Precio</label>
                            <div className="control">
                                <input className="form-control" value={newProduct?.price} onChange={(e) => {
                                    const { value } = e.target as HTMLInputElement
                                    setNewProduct({ ...newProduct, price: +value })
                                }} type="number" min={0} placeholder="Price" />
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="mb-3">
                            <label className="label">Cantidad</label>
                            <div className="control">
                                <input className="form-control" value={newProduct?.quantity} onChange={(e) => {
                                    const { value } = e.target as HTMLInputElement
                                    setNewProduct({ ...newProduct, quantity: +value })
                                }} type="number" min={0} placeholder="Cantidad" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="mb-3">
                            <label className="label">Tipo de Producto</label>
                            <SelectInput options={productTypes ?? []} selected={newProduct?.productType.id} onChange={(value) => setNewProduct({ ...newProduct, productType: { id: value } })} />
                        </div>
                    </div>

                    <div className="col">
                        <div className="mb-3">
                            <label className="label">Proveedor</label>
                            <SelectInput options={providers ?? []} selected={newProduct?.providerId} onChange={(value) => setNewProduct({ ...newProduct, providerId: value })} />
                        </div>
                    </div>
                </div>

                <div className="mb-3 d-flex">
                    <button className="btn btn-info w-100 me-2" onClick={saveProduct}>Guardar</button>
                    <button className="btn btn-danger w-100" onClick={handleCloseModal}>Cancelar</button>
                </div>
        </div>
    )
}