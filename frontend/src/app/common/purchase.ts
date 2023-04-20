import { ShippingMethod } from './shipping-method';
import { OrderItem } from './order-item';
import { Order } from './order';
import { Address } from './address';
import { Customer } from './customer';
export class Purchase {
    customer: Customer;
    shippingAddress: Address;
    billingAddress: Address;
    shippingMethod: ShippingMethod;
    order: Order;
    orderItems: OrderItem[];
}
