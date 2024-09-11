import { Fragment, useEffect, useState } from "react"
import { iProductType } from "../types/iProductType"
import { Service } from "../services/services"
import Swal from "sweetalert2"
import Paginator from "../utils/paginator"
import { ProductTypeForm } from "../components/ProductTypeForm"
import { Modal } from "react-bootstrap"

export const ProductType = () => {
    const [data, setData] = useState<iProductType[]>()
    const [search, setSearch] = useState<string>("")
    const [filteredData, setFilteredData] = useState<iProductType[]>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selected, setSelected] = useState<iProductType>()

    useEffect(() => {
        Service.productType().get().then((res) => setData(res))
    }, [])

    useEffect(() => {
        if (search === "") {
            setFilteredData(data)
        } else {
            setFilteredData(data?.filter((productType) => productType.name?.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search, data])

    const deleteProductType = async (id: number) => {
        Swal.fire({
            title: 'Aviso',
            text: '¿Desea eliminar este item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Service.productType().delete(id).then(
                    (res) => {
                        if (res) {
                            setData(data?.filter((productType) => productType.id !== id))
                        }
                    }
                )
            }
        })
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <Fragment>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>{selected?.id ? "Editar Tipo de Producto" : "Nuevo Tipo de Producto"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductTypeForm id={String(selected?.id || 'new')} handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
            <div className="container">
                <div className="mb-4">
                    <button className="btn btn-info"
                        onClick={() => {
                            setSelected(undefined)
                            setShowModal(true)
                        }}
                    >Nuevo Tipo de Producto</button>
                </div>

                <div className="box">
                    <div className="field mb-5">
                        <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearch(e.target.value)} value={search} />
                    </div>

                    {filteredData && <Paginator
                        data={filteredData}
                        itemsPerPage={10}
                        columns={[['Id', 'id'], ["Nombre", "name"]]}
                        deleteItem={deleteProductType}
                        setSelected={setSelected}
                        showModal={setShowModal}
                    />}

                </div>

            </div>
        </Fragment>
    )
}