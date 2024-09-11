import { ChangeEvent, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TitlePage } from "./core/TitlePage"
import { iBudget, iProductQuote, statuBudget } from "../types/iBudget"
import { Service } from "../services/services"
import { formatter, unformatter } from "../utils/formatter"
import { ProductsModal } from "./ProductsModal"
import { Card, Col, Row } from "react-bootstrap"

export const BudgetForm = () => {
    const { id } = useParams()
    const [budget, setBudget] = useState<iBudget>({} as iBudget)
    const [products, setProducts] = useState<iProductQuote[]>([])
    const [totales, setTotales] = useState({
        subtotal: 0,
        iva: 0,
        total: 0,
    })
    const [calculo, setCalculo] = useState({
        impuestos: [
            {
                id: 1,
                nombre: "Retención en la fuente",
                porcentaje: 0.04,
                base: 0,
                calc: false
            },
            {
                id: 2,
                nombre: "RETEICA",
                porcentaje: 0.008,
                base: 0,
                calc: false
            },
            {
                id: 3,
                nombre: "Retención de IVA",
                porcentaje: 0.15,
                base: 0,
                calc: false
            },
            {
                id: 4,
                nombre: "Tasa Prodeporte",
                porcentaje: 0,
                base: 0,
                calc: false
            }
        ],
        extras: {
            calc: false,
            porcentaje: 0.08
        },
        sistematizacion: {
            calc: false,
            val: 35736
        },
        comisiones: [
            {
                nombre: "Comisión 7%",
                porcentaje: 0.07,
                base: 0,
                calc: false,
                id: 1
            },
            {
                nombre: "Comisión 20%",
                porcentaje: 0.2,
                base: 0,
                calc: false,
                id: 2
            }
        ],
        operativo: 0,
        imp: 0,
        totalimp: 0,
        totalcomisiones: 0,
        basesiniva: 0,
    })

    const [utilidades, setUtilidades] = useState({
        bruta: 0,
        neta: 0
    })

    const [modal, setModal] = useState(false)

    const handleCloseModal = () => {
        setModal(false)
    }

    const handleProductChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedProducts = [...products];
        const id = updatedProducts[index].id;

        if (name === 'cost') {
            const precio = Number(unformatter(value)) / (1 - Number(updatedProducts[index].margen_percent / 100));
            updatedProducts[index][name] = Number(unformatter(value));
            updatedProducts[index].price = Number(precio);
            updatedProducts[index].margen_price = precio - updatedProducts[index].cost;
        }

        if (name === 'price') {
            const margen = Number(updatedProducts[index].cost) / (1 - updatedProducts[index].margen_percent / 100);
            updatedProducts[index].margen_price = Number(margen);
            updatedProducts[index][name] = Number(unformatter(value));
        }

        if (name === 'margen_percent') {
            const precio = Number(updatedProducts[index].cost) / (1 - (Number(value) / 100));
            updatedProducts[index][name] = Number(value);
            updatedProducts[index].price = Number(precio);
            updatedProducts[index].margen_price = precio - updatedProducts[index].cost;
        }

        if (name === 'quantity') {
            updatedProducts[index][name] = Number(value);
        }

        if (id) {
            Service.productQuote().update(id, updatedProducts[index]);
        }

        setProducts(updatedProducts);
        setTotales({
            ...totales,
            subtotal: products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0,
            iva: (products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0) * 0.19,
            total: ((products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0) * 0.19) + (budget.products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0),
        })
    };

    const handleAddProduct = (product: iProductQuote) => {
        const existingProduct = products.filter((p) => p.product.code === product.product.code);

        if (existingProduct.length > 0) {
            const maxDaysProduct = existingProduct.reduce((prev, current) => {
                return prev.days > current.days ? prev : current;
            });
            setProducts([...products, { ...product, cost: maxDaysProduct.price, days: maxDaysProduct.days + 1, quantity: 1, margen_percent: maxDaysProduct.margen_percent ?? 0, margen_price: maxDaysProduct.margen_price ?? 0 }]);
            Service.productQuote().create({
                ...product,
                days: maxDaysProduct.days + 1,
                quote: { id: Number(id) },
                cost: maxDaysProduct.price,
                margen_price: maxDaysProduct.margen_price ?? 0,
                margen_percent: product.margen_percent ?? 0
            });
        } else {
            const newProduct = {
                days: 1,
                quantity: 1,
                price: product.product.price,
                quote: { id: Number(id) },
                cost: product.cost ?? product.product.price,
                margen_price: product.margen_price ?? 0,
                margen_percent: product.margen_percent ?? 0,
                discount: 0,
                product: product.product
            }

            setProducts([...products, newProduct]);
            Service.productQuote().create(newProduct);
        }

        setModal(false);
    };

    const handleRemoveProduct = (index: number) => {
        const updatedProducts = [...products];
        const removedProduct = updatedProducts.splice(index, 1)[0];

        // Reorganizar los días de los productos restantes
        const reorganizedProducts = updatedProducts.map((product) => {
            if (product.product.code === removedProduct.product.code && product.days > removedProduct.days) {
                return { ...product, days: product.days - 1 };
            }
            return product;
        });

        if (removedProduct.id) {
            Service.productQuote().delete(removedProduct.id);
        }
        setProducts(reorganizedProducts);
    };

    useEffect(() => {
        const get = async () => {
            if (id === 'new') return
            if (!id) return

            await Service.quote().getOne(+id).then((data) => {
                const budget = data as iBudget
                budget.clientName = budget.client?.name ?? ''
                budget.userName = budget.user?.name ?? ''
                budget.contactPerson = budget.client?.contactPerson ?? ''
                setTotales({
                    ...totales,
                    subtotal: budget.products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0,
                    iva: (budget.products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0) * 0.19,
                    total: ((budget.products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0) * 0.19) + (budget.products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0),
                })
                setBudget(budget)
                setProducts(budget.products ?? [])
            })
        }
        get()
    }, [])

    useEffect(() => {
        setTotales({
            ...totales,
            subtotal: products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0,
            iva: (products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0) * 0.19,
            total: ((products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0) * 0.19) + (budget.products?.reduce((total: any, product: { price: any; quantity: any }) => Number(total) + (Number(product.price) * Number(product.quantity)), 0) ?? 0),
        })

        setCalculo({
            ...calculo,
            operativo: (products?.reduce((total, product) => Number(total) + (Number(product.cost) * Number(product.quantity)), 0) ?? 0),
            imp: (products?.reduce((total, product) => Number(total) + (Number(product.cost) * Number(product.quantity)), 0) * 0.1) ?? 0,
            totalimp: calculo.impuestos.reduce((total, impuesto) => {
                return total + (impuesto.calc ? (Number(impuesto.base) * Number(impuesto.porcentaje)) : 0);
            }, 0),
            basesiniva: (totales.total - calculo.totalimp) - (totales.iva - (calculo.impuestos.reduce((total, impuesto) => {
                return total + (impuesto.id === 3 ? (impuesto.calc ? (Number(impuesto.base) * Number(impuesto.porcentaje)) : 0) : 0);
            }, 0))) - (calculo.extras.calc ? (totales.subtotal * calculo.extras.porcentaje) : 0) - (calculo.sistematizacion.calc ? calculo.sistematizacion.val : 0),
            totalcomisiones: calculo.comisiones.reduce((total, comision) => {
                return total + (comision.calc ? (Number(comision.base) * Number(comision.porcentaje)) : 0);
            }, 0),
        })
    }, [products, calculo.impuestos, calculo.comisiones, calculo.sistematizacion, calculo.extras])

    useEffect(() => {
        setUtilidades({
            bruta: (((calculo.basesiniva - calculo.totalcomisiones) - (calculo.operativo + calculo.imp)) / (calculo.basesiniva - calculo.totalcomisiones) * 100),
            neta: ((((calculo.basesiniva - calculo.totalcomisiones) - (calculo.operativo + calculo.imp)) - (((totales.subtotal) * 0.1) + ((calculo.totalcomisiones) * 0.09) + ((totales.subtotal) * 0.011))) / totales.subtotal * 100)
        })
    }, [calculo])

    const handleChangeImpuesto = (idImpuesto: number, valor: number, calcular: boolean) => {
        const impuesto = calculo.impuestos.find((impuesto) => impuesto.id === idImpuesto)
        if (!impuesto) { return }

        if (idImpuesto === 1 || idImpuesto === 2) {
            impuesto.base = totales.subtotal
        } else if (idImpuesto === 3) {
            impuesto.base = totales.iva
        }

        impuesto.porcentaje = valor
        impuesto.calc = calcular
        setCalculo({ ...calculo, impuestos: [...calculo.impuestos] })
    }

    const handleChangeComision = (id: number, calc: boolean) => {
        const comision = calculo.comisiones.find((comision) => comision.id === id)
        if (!comision) { return }

        comision.calc = calc
        comision.base = (totales.total - (calculo.impuestos.reduce((total, impuesto) => {
            return total + (impuesto.calc ? (Number(impuesto.base) * Number(impuesto.porcentaje)) : 0);
        }, 0))) - (totales.iva - (calculo.impuestos.reduce((total, impuesto) => {
            return total + (impuesto.id === 3 ? (impuesto.calc ? (Number(impuesto.base) * Number(impuesto.porcentaje)) : 0) : 0);
        }, 0))) - (calculo.extras.calc ? (totales.subtotal * calculo.extras.porcentaje) : 0) - (calculo.sistematizacion.calc ? calculo.sistematizacion.val : 0)
        setCalculo({ ...calculo, comisiones: [...calculo.comisiones] })
    }

    return (
        <div className="container-fluid">
            <TitlePage title={`Presupuesto #${id === 'new' ? 'Nueva' : id}`} breadcrumb={{ name: 'Presupuestos', path: 'Home' }} />

            <Row>
                <Col md={{ span: 4, offset: 8 }}>
                    <Card className="border-0">
                        <Card.Body>
                            <h5 className={`p-3 rounded-3 fw-bold text-center text-white ${((budget.profitability ?? 0) < utilidades.bruta) ? 'bg-success' : 'bg-danger'}`}>Utilidad Bruta: {utilidades.bruta.toFixed(2)}%</h5>
                            <h5 className={`p-3 rounded-3 fw-bold text-center text-white bg-info`}>Utilidad Neta: {utilidades.neta.toFixed(2)}%</h5>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title fw-bold">Información del Cliente
                    </h5>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="client">Cliente</label>
                                <input type="text" value={budget.clientName} readOnly className="form-control" id="client" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="user">Vendedor</label>
                                <input type="text" value={budget.userName} readOnly className="form-control" id="user" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="user">Contacto</label>
                                <input type="text" value={budget.contactPerson ?? ''} readOnly className="form-control" id="user" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="user">Correo Electronico</label>
                                <input type="text" value={budget.client?.email ?? ''} readOnly className="form-control" id="user" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="user">Estado</label>

                                <select name="status" id="" className="form-select" defaultValue={budget.status}>
                                    {Object.values(statuBudget).map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductsModal
                modal={modal}
                handleCloseModal={handleCloseModal}
                handleAddProduct={handleAddProduct}
                quote={Number(id)}
            />

            <div className="card mt-3">
                <div className="card-header bg-white">
                    <button className="btn btn-outline-secondary float-end"><i className="bi bi-printer me-1"></i> Imprimir</button>
                    <button className="btn btn-info float-end me-2" onClick={() => setModal(true)}><i className="bi bi-search me-1"></i> Buscar producto</button>
                </div>
                <div className="card-body">
                    <table className="table table-hover table-sm table-bordered">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Cant.</th>
                                <th>Día</th>
                                <th>Costo</th>
                                <th>Precio Venta</th>
                                <th>Ut. (%)</th>
                                <th>Ut. ($)</th>
                                <th>Precio Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.product.code}</td>
                                    <td>{product.product.description}</td>
                                    <td style={{ width: '80px' }}>
                                        <input
                                            type="number"
                                            className="form-control text-end form-control-sm"
                                            name="quantity"
                                            min={1}
                                            onChange={(e) => handleProductChange(index, e)}
                                            value={product.quantity}
                                        />
                                    </td>
                                    <td>
                                        <span
                                            className="form-control text-end form-control-sm">{product.days}</span>
                                    </td>
                                    <td style={{ width: '110px' }}>
                                        <input
                                            type="text"
                                            className="form-control text-end form-control-sm"
                                            name="cost"
                                            value={formatter(product.cost ?? 0)}
                                            onChange={(e) => handleProductChange(index, e)}
                                        />
                                    </td>
                                    <td style={{ width: '110px' }}>
                                        <input
                                            type="text"
                                            className="form-control text-end form-control-sm"
                                            name="price"
                                            value={formatter(product.price)}
                                            onChange={(e) => handleProductChange(index, e)}
                                        />
                                    </td>
                                    <td style={{ width: '50px' }}>
                                        <input
                                            type="text"
                                            className="form-control text-end form-control-sm"
                                            name="margen_percent"
                                            onChange={(e) => handleProductChange(index, e)}
                                            value={product.margen_percent}
                                        />
                                    </td>
                                    <td style={{ width: '110px' }}>
                                        <input
                                            type="text"
                                            className="form-control text-end form-control-sm"
                                            name="margen_price"
                                            onChange={(e) => handleProductChange(index, e)}
                                            value={formatter(product.margen_price)}
                                        />
                                    </td>
                                    <td style={{ width: '110px' }}>
                                        <label
                                            className="form-control text-end form-control-sm">
                                            {formatter(
                                                product.price * product.quantity
                                            )}
                                        </label>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemoveProduct(index)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Subtotal</th>
                                <th className="text-end" style={{ width: "150px" }}>
                                    {formatter(totales.subtotal)}
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>IVA (19%)</th>
                                <th className="text-end">{formatter(totales.iva)}</th>
                                <th></th>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Total</th>
                                <th className="text-end">{formatter(totales.subtotal + totales.iva)}</th>
                                <th></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <table className="table table-sm table-bordered">
                        <tbody>
                            <tr>
                                <th className="text-end">Total Operativo</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter(calculo.operativo)}
                                </th>
                                <th style={{ width: '39px' }}></th>
                            </tr>
                            <tr>
                                <th className="text-end">Imp (10%)</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter(calculo.imp)}
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th className="text-end bg-info text-white">Gran Total</th>
                                <th style={{ width: '150px' }} className="text-end bg-info text-white">
                                    {formatter(calculo.operativo + calculo.imp)}
                                </th>
                                <th className="text-end bg-info text-white"></th>
                            </tr>
                            <tr>
                                <th className="text-end">Valor sin IVA</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter(totales.subtotal)}
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th className="text-end">IVA</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter(totales.iva)}
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th className="text-end bg-info text-white">TOTAL CONTRATO IVA INCLUIDO</th>
                                <th style={{ width: '150px' }} className="text-end bg-info text-white">
                                    {formatter(totales.subtotal + totales.iva)}
                                </th>
                                <th className="text-end bg-info text-white"></th>
                            </tr>

                            {calculo.impuestos.map((impuesto) => {
                                return (
                                    <tr>
                                        <th className="text-end">{impuesto.nombre}
                                            <input type="checkbox" className="form-check-input ms-1" onChange={() => handleChangeImpuesto(impuesto.id, impuesto.porcentaje, !impuesto.calc)} />
                                        </th>
                                        <th style={{ width: '150px' }} className="text-end">
                                            {impuesto.calc ? formatter(impuesto.base * impuesto.porcentaje) : 0}
                                        </th>
                                        <th></th>
                                    </tr>
                                )
                            })}
                            <tr>
                                <th className="text-end">Total Retenido</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter(calculo.totalimp)}
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th className="text-end bg-info text-white">PAGADO</th>
                                <th style={{ width: '150px' }} className="text-end bg-info text-white">
                                    {formatter((totales.subtotal + totales.iva) - calculo.totalimp)}
                                </th>
                                <th className="text-end bg-info text-white"></th>
                            </tr>
                            <tr>
                                <th className="text-end">IVA X PAGAR = IVA FACT - RETEIVA</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter(totales.iva - (calculo.impuestos.reduce((total, impuesto) => {
                                        return total + (impuesto.id === 3 ? (impuesto.calc ? (Number(impuesto.base) * Number(impuesto.porcentaje)) : 0) : 0);
                                    }, 0)))}
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th className="text-end">Estampillas<input type="checkbox" className="form-check-input ms-1" onChange={() => setCalculo({ ...calculo, extras: { ...calculo.extras, calc: !calculo.extras.calc } })} /></th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter(calculo.extras.calc ? (totales.subtotal * calculo.extras.porcentaje) : 0)}
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th className="text-end">Sistematización<input type="checkbox" className="form-check-input ms-1" onChange={() => setCalculo({ ...calculo, sistematizacion: { ...calculo.sistematizacion, calc: !calculo.sistematizacion.calc } })} /></th>
                                <th style={{ width: '150px' }} className="text-end">
                                    <input type="text" className="form-control form-control-sm text-end" value={formatter(calculo.sistematizacion.val)} disabled={!calculo.sistematizacion.calc} onChange={(e) => setCalculo({ ...calculo, sistematizacion: { ...calculo.sistematizacion, val: Number(unformatter(e.target.value)) } })} />
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th className="text-end bg-info text-white">BASE SIN IVA=PAGADO - IVA POR PAGAR</th>
                                <th style={{ width: '150px' }} className="text-end bg-info text-white">
                                    {formatter(calculo.basesiniva)}
                                </th>
                                <th className="text-end bg-info text-white"></th>
                            </tr>
                            {calculo.comisiones.map((comision) => {
                                return (
                                    <tr>
                                        <th className="text-end">{comision.nombre} <input type="checkbox" className="form-check-input ms-1" onChange={() => handleChangeComision(comision.id, !comision.calc)} /></th>
                                        <th style={{ width: '150px' }} className="text-end">
                                            {comision.calc ? formatter(((totales.total - (calculo.impuestos.reduce((total, impuesto) => {
                                                return total + (impuesto.calc ? (Number(impuesto.base) * Number(impuesto.porcentaje)) : 0);
                                            }, 0))) - (totales.iva - (calculo.impuestos.reduce((total, impuesto) => {
                                                return total + (impuesto.id === 3 ? (impuesto.calc ? (Number(impuesto.base) * Number(impuesto.porcentaje)) : 0) : 0);
                                            }, 0))) - (calculo.extras.calc ? (totales.subtotal * calculo.extras.porcentaje) : 0) - (calculo.sistematizacion.calc ? calculo.sistematizacion.val : 0)) * comision.porcentaje) : 0}
                                        </th>
                                        <th></th>
                                    </tr>
                                )
                            })}
                            <tr>
                                <th className="text-end bg-info text-white">TOTAL PARA TRABAJAR</th>
                                <th style={{ width: '150px' }} className="text-end bg-info text-white">
                                    {
                                        formatter(calculo.basesiniva - calculo.totalcomisiones)
                                    }
                                </th>
                                <th className="text-end bg-info text-white">
                                    {(((calculo.basesiniva - calculo.totalcomisiones) / totales.subtotal) * 100).toFixed(2)}%
                                </th>
                            </tr>
                            <tr>
                                <th className="text-end">GASTOS EVENTO (COSTO DE VENTA)</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter(calculo.operativo + calculo.imp)}
                                </th>
                                <th>{(((calculo.operativo + calculo.imp) / totales.subtotal) * 100).toFixed(2)}%</th>
                            </tr>
                            <tr>
                                <th className="text-end bg-info text-white">UTILIDAD BRUTA</th>
                                <th style={{ width: '150px' }} className="text-end bg-info text-white">
                                    {formatter((calculo.basesiniva - calculo.totalcomisiones) - (calculo.operativo + calculo.imp))}
                                </th>
                                <th className="text-end bg-info text-white">
                                    {(((calculo.basesiniva - calculo.totalcomisiones) - (calculo.operativo + calculo.imp)) / (calculo.basesiniva - calculo.totalcomisiones) * 100).toFixed(2)}%
                                </th>
                            </tr>
                            <tr>
                                <th className="text-end">GASTOS ADMIN (OFICINA)</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter((totales.subtotal) * 0.1)}
                                </th>
                                <th>{(((totales.subtotal) * 0.1) / (totales.subtotal) * 100).toFixed(2)}%</th>
                            </tr>
                            <tr>
                                <th className="text-end">Retenciones Gastos No Soportados</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter((calculo.totalcomisiones) * 0.09)}
                                </th>
                                <th>{(((calculo.totalcomisiones) * 0.09) / (totales.subtotal) * 100).toFixed(2)}%</th>
                            </tr>
                            <tr>
                                <th className="text-end">Autorretencion</th>
                                <th style={{ width: '150px' }} className="text-end">
                                    {formatter((totales.subtotal) * 0.011)}
                                </th>
                                <th>{(((totales.subtotal) * 0.011) / (totales.subtotal) * 100).toFixed(2)}%</th>
                            </tr>
                            <tr>
                                <th className="text-end bg-info text-white">Utilidad Neta</th>
                                <th style={{ width: '150px' }} className="text-end bg-info text-white">
                                    {formatter(((calculo.basesiniva - calculo.totalcomisiones) - (calculo.operativo + calculo.imp)) - (((totales.subtotal) * 0.1) + ((calculo.totalcomisiones) * 0.09) + ((totales.subtotal) * 0.011)))}
                                </th>
                                <th className="bg-info text-white">
                                    {((((calculo.basesiniva - calculo.totalcomisiones) - (calculo.operativo + calculo.imp)) - (((totales.subtotal) * 0.1) + ((calculo.totalcomisiones) * 0.09) + ((totales.subtotal) * 0.011))) / totales.subtotal * 100).toFixed(2)}%
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}