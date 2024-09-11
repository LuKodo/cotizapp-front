import React, { useEffect, useState } from 'react';

interface Quote {
  id: number;
  customerName: string;
  items: { productId: number; productName: string; price: number; quantity: number }[];
  createdAt: string;
}

const QuoteList: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes').then((res) => res.json());
        setQuotes(response);
      } catch (error) {
        console.error('Error al obtener las cotizaciones:', error);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <div>
      <h2>Lista de Cotizaciones</h2>
      <ul>
        {quotes.map((quote) => (
          <li key={quote.id}>
            <h3>{quote.customerName}</h3>
            <ul>
              {quote.items.map((item) => (
                <li key={item.productId}>
                  {item.productName} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <p>Fecha de creación: {quote.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuoteList;
