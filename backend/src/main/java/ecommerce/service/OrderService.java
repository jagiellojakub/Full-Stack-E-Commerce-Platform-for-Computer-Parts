package ecommerce.service;

import ecommerce.entity.OrderItem;

import java.util.Set;

public interface OrderService {

    public Set<OrderItem> findOrderItemsByOrderTrackingNumber(String orderTrackingNumber);
}
