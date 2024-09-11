import { iProductType } from "./iProductType";

export interface iProduct {
    id?: number;
    name: string;
    price: number;
    code: string;
    description: string;
    providerId: number;
    productType: iProductType;
    quantity: number;
}