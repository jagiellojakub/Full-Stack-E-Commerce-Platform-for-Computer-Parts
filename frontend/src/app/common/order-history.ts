import { Address } from './address';
export class OrderHistory {

    constructor(public id: string,
                public orderTrackingNumber: string,
                public totalPrice: number,
                public totalQuantity: number,
                public shippingAddress: Address,
                public dateCreated: Date) {}
}
