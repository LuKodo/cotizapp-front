import { iClient } from "./iClient";
import { iProduct } from "./iProduct";
import { iUser } from "./iUser";

export enum statuBudget {
  Pendiente = "Pendiente",
  Preparada = "Preparada",
  Lista = "Lista",
}

export interface iProductQuote {
  id?: number;
  product: iProduct;
  quote: { id: number };
  quantity: number;
  price: number;
  cost: number;
  margen_percent: number;
  margen_price: number;
  discount: number;
  days: number;
}

export interface iBudget {
  id: number;
  client: iClient;
  clientName?: string;
  contactPerson?: string;
  products?: iProductQuote[];
  budget: number;
  status: statuBudget;
  user: iUser;
  userName?: string;
  profitability?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}
