// src/components/QuoteForm.tsx
import React, { useState, useEffect } from 'react';
import { iQuote } from '../types/iQuote';
import { iProduct } from '../types/iProduct';
import { iClient } from '../types/iClient';

interface props {
    quote: iQuote | null
}


const QuoteForm: React.FC<props> = ({ quote }) => {
    const [customerName, setCustomerName] = useState('');
    const [products, setProducts] = useState<iProduct[]>([]);
    const [clients, setClients] = useState<iClient[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            await fetch('/api/product').then((response) => {
                response.json().then((data) => {
                    setProducts(data);
                });
            })

            await fetch('/api/clients').then((response) => {
                response.json().then((data) => {
                    setClients(data);
                });
            })
        }

        fetchProducts();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const items = products.map((product: iProduct) => ({
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
        }));

        try {
            const response = fetch('/api/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerName, items }),
            })
            console.log(response);
        } catch (error) {
            console.log(error);

        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre del Cliente:
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </label>



                <button type="submit">Guardar Cotización</button>
            </form>
        </div>
    );
};

export default QuoteForm;
