package ecommerce.service;

import ecommerce.dao.OrderRepository;
import ecommerce.entity.Order;
import ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class OrderServiceImpl implements OrderService{

    private OrderRepository orderRepository;

    public Set<OrderItem> findOrderItemsByOrderTrackingNumber(String orderTrackingNumber) {
        Optional<Order> optionalOrder = Optional.ofNullable(orderRepository.findByOrderTrackingNumber(orderTrackingNumber));
        if (optionalOrder.isPresent()) {
            return optionalOrder.get().getOrderItems();
        } else {
            return null;
        }
    }
}
