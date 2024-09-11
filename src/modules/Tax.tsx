import { Fragment, useEffect, useState } from "react"
import Swal from "sweetalert2"
import Paginator from "../utils/paginator"
import { iTax } from "../types/iTax"
import { Service } from "../services/services"
import { TaxForm } from "../components/TaxForm"

export const Tax = () => {
    const [data, setData] = useState<iTax[]>()
    const [search, setSearch] = useState<string>("")
    const [filteredData, setFilteredData] = useState<iTax[]>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<iTax>()

    useEffect(() => {
        const fetchData = async () => {
            await Service.tax().get().then((res) => {
                setData(res)
                setFilteredData(res)
            })
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (search === "") {
            setFilteredData(data)
        } else {
            setFilteredData(data?.filter((tax) => tax.name.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search])

    const deleteItem = async (id: number) => {
        Swal.fire({
            title: 'Aviso',
            text: '¿Desea eliminar este item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Service.tax().delete(id).then(
                    (res) => {
                        if (res) {
                            setFilteredData(data?.filter((tax) => tax.id !== id))
                        }
                    }
                )
            }
        })
    }

    const handleCloseModal = async () => {
        setSelectedItem(undefined)
        await Service.tax().get().then((res) => {
            setData(res)
            setFilteredData(res)
        })
        setShowModal(false)
    }

    return (
        <Fragment>
            <div className={`modal ${showModal ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => setShowModal(false)}>
                </div>
                <div className="modal-content">
                    <TaxForm id={selectedItem ? String(selectedItem?.id) : 'new'} handleCloseModal={handleCloseModal} />
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="container">
                <div className="mb-4">
                    <button
                        className="btn btn-info"
                        onClick={() => {
                            setSelectedItem(undefined)
                            setShowModal(true)
                        }}
                    >
                        Nuevo Impuesto
                    </button>
                </div>

                <div className="box">
                    <div className="field mb-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            value={search}
                        />
                    </div>


                    {filteredData && <Paginator
                        data={filteredData}
                        itemsPerPage={10}
                        columns={[['Id', 'id'], ["Nombre", "name"], ["%", 'value']]}
                        deleteItem={deleteItem}
                        setSelected={setSelectedItem}
                        showModal={setShowModal}
                    />}
                </div>

            </div>
        </Fragment>
    )
}