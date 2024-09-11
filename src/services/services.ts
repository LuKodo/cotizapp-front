import { iProductType } from "../types/iProductType";
import { iProduct } from "../types/iProduct";
import { iTax } from "../types/iTax";
import { iProductQuote } from "../types/iBudget";

export const Service = {
  product: () => {
    return {
      get: async () => {
        const response = await fetch("/api/product").then((res) => res.json());
        return response;
      },
      getOne: async (id: number) => {
        const response = await fetch(`/api/product/${id}`).then((res) =>
          res.json()
        );
        return response;
      },
      update: () => {},
      post: async (item: iProduct) => {
        const response = await fetch("/api/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }).then((res) => res.json());
        return response;
      },
      delete: async (id: number) => {
        const response = await fetch(`/api/product/${id}`, {
          method: "DELETE",
        }).then((res) => res.json());
        return response;
      },
    };
  },
  provider: () => {
    return {
      get: async () => {
        const response = await fetch("/api/provider").then((res) => res.json());
        return response;
      },
      getOne: async (id: number) => {
        const response = await fetch(`/api/provider/${id}`).then((res) =>
          res.json()
        );
        return response;
      },
      post: async (item: Record<string, any>) => {
        const response = await fetch("/api/provider", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }).then((res) => res.json());
        return response;
      },
      update: async (id: number, item: Record<string, any>) => {
        const response = await fetch(`/api/provider/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }).then((res) => res.json());
        return response;
      },
    };
  },
  client: () => {
    return {
      get: async () => {
        const response = await fetch("/api/client").then((res) => res.json());
        return response;
      },
      getOne: async (id: number) => {
        const response = await fetch(`/api/client/${id}`).then((res) =>
          res.json()
        );
        return response;
      },
      post: async (item: Record<string, any>) => {
        const response = await fetch("/api/client", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }).then((res) => res.json());
        return response;
      },
      update: async (id: number, item: Record<string, any>) => {
        const response = await fetch(`/api/client/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }).then((res) => res.json());
        return response;
      },
      delete: async (id: number) => {
        const response = await fetch(`/api/client/${id}`, {
          method: "DELETE",
        }).then((res) => res.json());
        return response;
      },
    };
  },
  productType: () => {
    return {
      get: async () => {
        const response = await fetch("/api/product-types").then((res) =>
          res.json()
        );
        return response;
      },
      getOne: async (id: number) => {
        const response = await fetch(`/api/product-types/${id}`).then((res) =>
          res.json()
        );
        return response;
      },
      post: async (productType: iProductType) => {
        const response = await fetch("/api/product-types", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productType),
        }).then((res) => res.json());
        return response;
      },
      delete: async (id: number) => {
        const response = await fetch(`/api/product-types/${id}`, {
          method: "DELETE",
        }).then((res) => res.json());
        return response;
      },
    };
  },
  tax: () => {
    return {
      get: async () => {
        const response = await fetch("/api/taxes").then((res) => res.json());
        return response;
      },
      getOne: async (id: number) => {
        const response = await fetch(`/api/taxes/${id}`).then((res) =>
          res.json()
        );
        return response;
      },
      post: async (tax: iTax) => {
        const response = await fetch("/api/taxes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tax),
        }).then((res) => res.json());
        return response;
      },
      patch: async (id: number, tax: iTax) => {
        const response = await fetch(`/api/taxes/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tax),
        }).then((res) => res.json());
        return response;
      },
      delete: async (id: number) => {
        const response = await fetch(`/api/taxes/${id}`, {
          method: "DELETE",
        }).then((res) => res.json());
        return response;
      },
    };
  },
  quote: () => {
    return {
      get: async () => {
        const response = await fetch("/api/quotes").then((res) => res.json());
        return response;
      },
      getOne: async (id: number) => {
        const response = await fetch(`/api/quotes/${id}`).then((res) =>
          res.json()
        );
        return response;
      },
    };
  },
  productQuote: () => {
    return {
      create: async (productQuote: iProductQuote) => {
        const response = await fetch("/api/ProductsQuote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productQuote),
        }).then((res) => res.json());
        return response;
      },
      get: async () => {
        const response = await fetch("/api/ProductsQuote").then((res) =>
          res.json()
        );
        return response;
      },
      update: async (id: number, productQuote: iProductQuote) => {
        const response = await fetch(`/api/ProductsQuote/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productQuote),
        }).then((res) => res.json());
        return response;
      },
      delete: async (id: number) => {
        const response = await fetch(`/api/ProductsQuote/${id}`, {
          method: "DELETE",
        }).then((res) => res.json());
        return response;
      },
    }
  }
};
