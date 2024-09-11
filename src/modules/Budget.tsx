import { useEffect, useState } from "react"
import { TitlePage } from "../components/core/TitlePage"
import { iBudget } from "../types/iBudget"
import { Service } from "../services/services"
import Swal from "sweetalert2"
import dayjs from "dayjs"
import { formatter } from "../utils/formatter"
import { Link } from "react-router-dom"

export const Budget = () => {
    const [budgets, setBudgets] = useState<iBudget[]>()
    const itemsPerPage = 10
    const [page, setPage] = useState<number>(1)
    const [totalPages, _setTotalPages] = useState<number>(0)
    const [search, setSearch] = useState<string>("")
    const [filteredData, setFilteredData] = useState<iBudget[]>()

    useEffect(() => {
        const get = async () => {
            await Service.quote().get().then((data) => {
                const budgets = data.map((budget: iBudget) => {
                    budget.clientName = budget.client?.name ?? ''
                    budget.userName = budget.user?.name ?? ''
                    return budget
                })
                setBudgets(budgets)
            })
        }
        get()
    }, [])

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
                            setBudgets(budgets?.filter((product) => product.id !== id))
                        }
                    }
                )
            }
        })
    }

    return (
        <div className="container-fluid">
            <TitlePage title="Presupuestos" breadcrumb={{ name: 'Presupuestos', path: 'Home' }} />

            <div className="card">
                <div className="card-header">
                    <h5 className="card-title fw-bold">Presupuesto</h5>
                </div>

                <div className="card-body">
                    <div className="table-responsive overflow-x-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                        <table className="table mb-0 align-middle">
                            <thead className="text-dark fs-4">
                                <tr>
                                    <th>#</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Estado</th>
                                    <th>Neto</th>
                                    <th>IVA</th>
                                    <th>Total</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgets?.map((budget) => (
                                    <tr key={budget.id}>
                                        <td>{budget.id}</td>
                                        <td>{dayjs(budget.createdAt).format('DD-MM-YYYY')}</td>
                                        <td>{budget.clientName}</td>
                                        <td>
                                            <span className={`badge bg-${budget.status === 'Pendiente' ? 'warning' : 'success'}`}>
                                                {budget.status}
                                            </span>
                                        </td>
                                        <td>{formatter(budget.budget)}</td>
                                        <td>{budget.profitability} %</td>
                                        <td>{formatter(budget.total ?? 0)}</td>
                                        <td>
                                            <div className="btn-group">
                                                <Link to={`/budget/${budget.id}`} className='btn btn-sm btn-light'

                                                >
                                                    <i className="bi bi-pencil-fill text-info" />
                                                </Link>

                                                <button className='btn btn-sm btn-light'>
                                                    <i className="bi bi-currency-dollar text-success" />
                                                </button>

                                                <button className='btn btn-sm btn-light'
                                                    onClick={() => deleteItem(budget.id)}
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
    )
}