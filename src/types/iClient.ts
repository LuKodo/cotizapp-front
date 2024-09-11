export enum ClientType {
    PUBLICO = 'Público',
    PRIVADO = 'Privado',
}

export interface iClient {
    id: number
    name: string
    nit: string
    address: string
    phone: string
    email: string
    contactPerson: string
    type: ClientType
}