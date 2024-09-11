export interface iQuote {
    id: number;
    customerName: string;
    items: {
        productId: number;
        productName: string;
        price: number;
        quantity: number;
    }[]
}