import { Link, useLocation } from "react-router-dom"
import { Fragment } from "react/jsx-runtime"

export const Menu = () => {
    const location = useLocation()

    return (
        <Fragment>
            <header className="gradient">
                <nav className='navbar top-navbar navbar-expand-md navbar-light'>
                    <div className="container">
                        <div className="navbar-header">
                            <h1 className='navbar-brand text-white mb-0'>
                                <i className="bi bi-calculator" /> Cotizador HiQ
                            </h1>
                        </div>
                    </div>
                </nav>
            </header>

            <nav className='sidebar-nav overflow-auto' style={{ height: 'calc(100vh - 60px)' }}>
                <ul id="sidebarnav" className="mb-0">
                    <li className="nav-small-cap">
                        <span className="hide-menu ps-3">
                            Aplicaciones
                        </span>
                    </li>

                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                            <span>
                                <i className="bi bi-speedometer2" />
                            </span>
                            <span className="hide-menu ps-2">
                                Dashboard
                            </span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${(location.pathname.split('/')[1] === 'budget') ? 'active' : ''}`} to="/budget">
                            <span>
                                <i className="bi bi-calculator" />
                            </span>
                            <span className="hide-menu ps-2">
                                Presupuestos
                            </span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/close-card' ? 'active' : ''}`} to="/close-card">
                            <span>
                                <i className="bi bi-calculator" />
                            </span>
                            <span className="hide-menu ps-2">
                                Tarjeta de Cierre
                            </span>

                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/config/clients' ? 'active' : ''}`} to="/config/clients">
                            <span>
                                <i className="bi bi-people" />
                            </span>
                            <span className="hide-menu ps-2">
                                Clientes
                            </span>
                        </Link>
                    </li>

                    <li className="nav-small-cap">
                        <span className="hide-menu ps-3">
                            Catalogo
                        </span>
                    </li>

                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/product' ? 'active' : ''}`} to="/product">
                            <span>
                                <i className="bi bi-box2" />
                            </span>
                            <span className="hide-menu ps-2">
                                Productos
                            </span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/config/provider' ? 'active' : ''}`} to="/config/provider">
                            <span>
                                <i className="bi bi-person-vcard" />
                            </span>
                            <span className="hide-menu ps-2">
                                Proveedores
                            </span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/config/product-types' ? 'active' : ''}`} to="/config/product-types">
                            <span>
                                <i className="bi bi-box2" />
                            </span>
                            <span className="hide-menu ps-2">
                                Tipos de Productos
                            </span>
                        </Link>
                    </li>

                    <li className="nav-small-cap">
                        <span className="hide-menu ps-3">
                            Administrar accesos
                        </span>
                    </li>

                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/config/user' ? 'active' : ''}`} to="/config/user">
                            <span>
                                <i className="bi bi-people" />
                            </span>
                            <span className="hide-menu ps-2">
                                Usuarios
                            </span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/config/role' ? 'active' : ''}`} to="/config/role">
                            <span>
                                <i className="bi bi-person-gear" />
                            </span>
                            <span className="hide-menu ps-2">
                                Roles
                            </span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/config/tax' ? 'active' : ''}`} to="/config/tax">
                            <span>
                                <i className="bi bi-cash" />
                            </span>
                            <span className="hide-menu ps-2">
                                Impuestos
                            </span>

                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link className={`sidebar-link ${location.pathname === '/config/profile' ? 'active' : ''}`} to="/config/profile">
                            <span>
                                <i className="bi bi-building-gear" />
                            </span>
                            <span className="hide-menu ps-2">
                                Perfíl de la empresa
                            </span>

                        </Link>
                    </li>
                </ul>
            </nav>
        </Fragment>
    )
}