import { useEffect, useState } from "react"
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import { iProduct } from "../types/iProduct";
import { Service } from "../services/services";
import { iProductQuote } from "../types/iBudget";

interface iProps {
    modal: boolean
    handleCloseModal: () => void
    handleAddProduct: (product: iProductQuote) => void
    quote: number
}

export const ProductsModal = ({ modal, handleCloseModal, handleAddProduct, quote }: iProps) => {
    const [search, setSearch] = useState<string>("");
    const [products, setProducts] = useState<iProduct[]>([]);
    const [productsQuote, setProductsQuote] = useState<iProductQuote[]>([]);

    useEffect(() => {
        const get = async () => {
            await Service.product().get().then((data) => {
                setProducts(data)
                setProductsQuote(data.map((product: iProduct) => ({
                    product,
                    quantity: 0,
                    price: 0,
                    discount: 0,
                    days: 0
                })))
            })
        }

        get()
    }, [])

    return (
        <Modal show={modal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Buscar Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Buscar"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button variant="primary">Buscar</Button>
                        </InputGroup>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsQuote.map((productQuote, index) => {
                                    if (productQuote.product.name.toLowerCase().includes(search.toLowerCase())) {
                                        return (
                                            <tr key={index}>
                                                <td>{productQuote.product.code}</td>
                                                <td>{productQuote.product.name}</td>
                                                <td>{productQuote.product.price}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleAddProduct({
                                                            product: productQuote.product,
                                                            quantity: 1,
                                                            price: productQuote.product.price,
                                                            discount: 0,
                                                            days: 0,
                                                            quote: { id: quote }
                                                        })}
                                                    >
                                                        Agregar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }

                                    return null
                                })}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}