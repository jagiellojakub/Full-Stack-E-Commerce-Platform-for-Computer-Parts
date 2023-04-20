package ecommerce.dto;

import ecommerce.entity.*;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private ShippingMethod shippingMethod;
    private Set<OrderItem> orderItems;
}
