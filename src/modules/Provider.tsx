import { Fragment, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Service } from "../services/services"
import { iProvider } from "../types/iProvider"
import { ProviderForm } from "../components/ProviderForm"
import { TitlePage } from "../components/core/TitlePage"
import { Modal } from "react-bootstrap"

export const Provider = () => {
    const [data, setData] = useState<iProvider[]>()
    const [page, setPage] = useState<number>(1)
    const itemsPerPage = 10
    const [totalPages, _setTotalPages] = useState<number>(0)
    const [search, setSearch] = useState<string>("")
    const [filteredData, setFilteredData] = useState<iProvider[]>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [item, setItem] = useState<iProvider>()

    useEffect(() => {
        Service.provider().get().then((res) => setData(res))
    }, [])

    useEffect(() => {
        if (search === "") {
            setFilteredData(data)
        } else {
            setFilteredData(data?.filter((tax) => tax.name.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search, data])

    const deleteTax = async (id: number) => {
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
                            setData(data?.filter((tax) => tax.id !== id))
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
                    <Modal.Title>{item?.id ? 'Editar Proveedor' : 'Crear Proveedor'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProviderForm id={String(item?.id || 'new')} handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
            <div className="container-fluid">
                <TitlePage title="Proveedores" breadcrumb={{ name: 'Proveedores', path: 'Home' }} />

                <div className="card">
                    <div className="card-body">
                        <div className="d-md-flex align-items-center justify-content-between mb-9">
                            <div className="mb-9 mb-md-0">
                                <h4 className="card-title">Listado de Proveedores</h4>
                            </div>

                            <div className="d-flex align-items-center justify-content-end w-50">
                                <form className="position-relative me-3 w-50">
                                    <input type="text" className="form-control form-control-sm search-chat ps-5" id="text-srh" placeholder="Buscar proveedor" onChange={(e) => setSearch(e.target.value)} value={search} />
                                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y fs-3 text-dark ms-3"></i>
                                </form>

                                <button className="btn btn-sm btn-primary"
                                    onClick={() => {
                                        setItem(undefined)
                                        setShowModal(true)
                                    }}
                                >
                                    Crear Proveedor
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive overflow-x-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                            <table className="table mb-0 align-middle">
                                <thead className="text-dark fs-4">
                                    <tr>
                                        <th>Id</th>
                                        <th>Nombre</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredData?.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-light" onClick={() => {
                                                        setItem(item)
                                                        setShowModal(true)
                                                    }}>
                                                        <i className="bi bi-pencil-fill text-primary" />
                                                    </button>
                                                    <button className="btn btn-sm btn-light" onClick={() => deleteTax(item.id)}>
                                                        <i className="bi bi-trash-fill text-danger" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-9">
                            <p className="mb-0 fw-normal">{itemsPerPage - itemsPerPage + 1}-{itemsPerPage} de {totalPages}</p>
                            <nav aria-label="Page navigation example">
                                <ul className="pagination mb-0 align-items-center">
                                    <li className="page-item">
                                        <a className="page-link border-0 d-flex align-items-center text-muted fw-normal" onClick={() => setPage(page - 1)}>Previous</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link border-0 d-flex align-items-center fw-normal" onClick={() => setPage(page + 1)}>Next</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}