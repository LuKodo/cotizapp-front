import { iBreadcrumb } from "../../types/iBreadcrumb"

export const Breadcrumb: React.FC<iBreadcrumb> = ({ path, name }) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="#">{path}</a></li>
                <li className="breadcrumb-item"><a href="#" aria-current="page">{name}</a></li>
            </ol>
        </nav>
    )
}