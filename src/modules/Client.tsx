import { Fragment, useEffect, useState } from "react"
import { iClient } from "../types/iClient"
import { Service } from "../services/services"
import Swal from "sweetalert2"
import { ClientForm } from "../components/ClientForm"
import { TitlePage } from "../components/core/TitlePage"
import { Modal } from "react-bootstrap"

export const Client = () => {
    const [data, setData] = useState<iClient[]>()
    const [page, setPage] = useState<number>(1)
    const itemsPerPage = 10
    const [totalPages, setTotalPages] = useState<number>(0)
    const [search, setSearch] = useState<string>("")
    const [filteredData, setFilteredData] = useState<iClient[]>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selected, setSelected] = useState<iClient>()

    useEffect(() => {
        Service.client().get().then((res) => {
            setData(res)
            setFilteredData(res)
            setTotalPages(Math.ceil(res.length / itemsPerPage))
        })
    }, [])

    useEffect(() => {
        if (search === "") {
            setFilteredData(data)
        } else {
            setFilteredData(data?.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search, data])

    const deleteProductType = async (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: '¿Desea eliminar este item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Service.client().delete(id).then(
                    (res) => {
                        if (res) {
                            setData(data?.filter((item) => item.id !== id))
                        }
                    }
                )
            }
        })
    }

    const handleCloseModal = () => {
        setSelected(undefined)
        Service.client().get().then((res) => setData(res))
        setShowModal(false)
    }

    return (
        <Fragment>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>{selected ? 'Editar cliente' : 'Nuevo cliente'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ClientForm id={String(selected?.id || 'new')} handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>

            <div className="container-fluid">
                <TitlePage title="Clientes" breadcrumb={{ name: 'Clientes', path: 'Home' }} />
                <button className="btn btn-info mb-2"
                    onClick={() => {
                        setSelected(undefined)
                        setShowModal(true)
                    }}
                >
                    Nuevo Cliente
                </button>

                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title fw-bold">Listado de Clientes</h5>
                    </div>
                    <div className="card-body">
                        <div className="mb-4">
                            <input type="text" className="form-control" placeholder="Buscar" onChange={(e) => setSearch(e.target.value)} value={search} />
                        </div>

                        <div className="table-responsive border rounded-4">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Dirección</th>
                                        <th>Contacto</th>
                                        <th>Tipo</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData?.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.address}</td>
                                            <td>{item.contactPerson}</td>
                                            <td>{item.type}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-light"
                                                        onClick={() => {
                                                            setSelected(item)
                                                            setShowModal(true)
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil-fill text-primary" />
                                                    </button>

                                                    <button className="btn btn-sm btn-light"
                                                        onClick={() => deleteProductType(item.id)}
                                                    >
                                                        <i className="bi bi-trash-fill text-danger" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className='d-flex justify-content-end align-items-center'>
                            <button className='btn btn-sm btn-info me-2' onClick={() => setPage(page - 1)} disabled={page === 1}>
                                <i className="bi bi-chevron-left" />
                            </button>
                            <span className='fw-bold'>{`Página ${page} de ${totalPages}`}</span>
                            <button className='btn btn-sm btn-info ms-2' onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                <i className="bi bi-chevron-right" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}