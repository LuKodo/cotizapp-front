import { Fragment, useEffect, useState } from "react"
import { Service } from "../services/services"
import Swal from "sweetalert2"
import { ProductForm } from "../components/ProductForm"
import { iProduct } from "../types/iProduct"
import { TitlePage } from "../components/core/TitlePage"
import { Modal } from "react-bootstrap"

export const Product = () => {
    const [data, setData] = useState<iProduct[]>()
    const [page, setPage] = useState<number>(1)
    const itemsPerPage = 10
    const [totalPages, setTotalPages] = useState<number>(0)
    const [search, setSearch] = useState<string>("")
    const [filteredData, setFilteredData] = useState<iProduct[]>()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selected, setSelected] = useState<iProduct>()

    useEffect(() => {
        const getItems = async () => {
            await Service.product().get().then((res) => {
                setData(res)
                setFilteredData(res)
                setTotalPages(Math.ceil(res.length / itemsPerPage))
            })
        }

        getItems()
    }, [])

    useEffect(() => {
        if (search === "") {
            setFilteredData(data)
        } else {
            setFilteredData(data?.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())))
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
                Service.product().delete(id).then(
                    (res) => {
                        if (res) {
                            setData(data?.filter((product) => product.id !== id))
                        }
                    }
                )
            }
        })
    }

    const handleCloseModal = async () => {
        setSelected(undefined)
        await Service.product().get().then((res) => {
            setData(res)
            setFilteredData(res)
        })
        setShowModal(false)
    }

    return (
        <Fragment>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>{selected?.id ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductForm id={String(selected?.id || 'new')} handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
            <div className="container-fluid">
                <TitlePage title="Productos" breadcrumb={{ name: 'Productos', path: 'Home' }} />

                <div className="card">
                    <div className="card-body">
                        <div className="d-md-flex align-items-center justify-content-between mb-9">
                            <div className="mb-9 mb-md-0">
                                <h4 className="card-title">Listado de Productos</h4>
                            </div>

                            <div className="d-flex align-items-center justify-content-end w-50">
                                <form className="position-relative me-3 w-50">
                                    <input type="text" className="form-control form-control-sm search-chat ps-5" id="text-srh" placeholder="Buscar" onChange={(e) => setSearch(e.target.value)} value={search} />
                                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y fs-3 text-dark ms-3"></i>
                                </form>

                                <button className="btn btn-sm btn-primary"
                                    onClick={() => {
                                        setSelected(undefined)
                                        setShowModal(true)
                                    }}
                                >
                                    Crear Producto
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive overflow-x-auto">
                            <table className="table mb-0 align-middle">
                                <thead className="text-dark fs-4">
                                    <tr>
                                        <th>Id</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Código</th>
                                        <th>Veces</th>
                                        <th>Descripción</th>
                                        <th>Tipo</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData && filteredData.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>{Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price)}</td>
                                            <td>{product.code}</td>
                                            <td>{product.description}</td>
                                            <td>
                                                <span className="badge text-bg-success">
                                                    {product.productType.name}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group">
                                                    <button
                                                        className='btn btn-sm btn-light'
                                                        onClick={() => {
                                                            setSelected(product)
                                                            setShowModal(true)
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil-fill text-info" />
                                                    </button>

                                                    <button
                                                        className='btn btn-sm btn-light'
                                                        onClick={() => deleteItem(product.id)}
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