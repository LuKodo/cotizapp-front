import { useEffect, useState } from "react"
import { Service } from "../services/services"
import { TitlePage } from "../components/core/TitlePage"
import { Link } from "react-router-dom"

interface data {
    quotes: number
    products: number
    clients: number
}

const Dashboard = () => {
    const [data, setData] = useState<data>({} as data)

    useEffect(() => {
        const fetchData = async () => {
            const quotes = await Service.quote().get()
            const products = await Service.product().get()
            const clients = await Service.client().get()

            setData({ quotes: quotes.length, products: products.length, clients: clients.length })
        }

        fetchData()
    }, [])


    return (
        <div className="container-fluid">
            <TitlePage title="Dashboard" breadcrumb={{ name: 'Dashboard', path: 'Home' }} />

            <div className="row">
                <div className="col-lg-12 col-xl-8">
                    <div className="row">
                        <Link to="/budget" className="col-sm-4">
                            <div className="card warning-card overflow-hidden text-bg-primary">
                                <div className="card-body p-4">
                                    <div className="mb-7">
                                        <i className="bi bi-bag fs-5 fw-lighter"></i>
                                    </div>
                                    <h5 className="text-white fw-bold fs-14 text-nowrap">
                                        {data?.quotes}
                                    </h5>
                                    <p className="opacity-50 mb-0 ">Cotizaciones</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/product" className="col-sm-4">
                            <div className="card warning-card overflow-hidden text-bg-danger">
                                <div className="card-body p-4">
                                    <div className="mb-7">
                                        <i className="bi bi-box2 fs-5 fw-lighter"></i>
                                    </div>
                                    <h5 className="text-white fw-bold fs-14 text-nowrap">
                                        {data?.products}
                                    </h5>
                                    <p className="opacity-50 mb-0 ">Productos</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/config/clients" className="col-sm-4">
                            <div className="card warning-card overflow-hidden text-bg-success">
                                <div className="card-body p-4">
                                    <div className="mb-7">
                                        <i className="bi bi-people fs-5 fw-lighter"></i>
                                    </div>
                                    <h5 className="text-white fw-bold fs-14 text-nowrap">
                                        {data?.clients}
                                    </h5>
                                    <p className="opacity-50 mb-0 ">Clientes</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard