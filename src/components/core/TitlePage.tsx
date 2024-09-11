import { Fragment } from "react/jsx-runtime"
import { iTitle } from "../../types/iTitle"
import { Breadcrumb } from "./Breadcrumb"

export const TitlePage: React.FC<iTitle> = ({ title, breadcrumb }) => {
    return (
        <Fragment>
            <header className="topbar sticky-top">
                <div className="with-vertical">
                    <nav className="navbar navbar-expand-lg p-0">
                        <ul className="navbar-nav">
                            <li className="nav-item nav-icon-hover-bg rounded-circle">
                                <a className="nav-link sidebartoggler" id="headerCollapse" href="#">
                                    <i className="bi bi-list"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <div className="mb-3 overflow-hidden position-relative">
                <div className="px-3">
                    <h4 className="fs-6 mb-0">{title}</h4>
                    <Breadcrumb path={breadcrumb.path} name={breadcrumb.name} />
                </div>
            </div>
        </Fragment>
    )
}