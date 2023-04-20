package ecommerce.dao;

import ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.UUID;

@CrossOrigin("https://localhost:4200")
@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Page<Order> findByCustomerEmailOrderByDateCreatedDesc(@Param("email") String email, Pageable pageable);

    Order findByOrderTrackingNumber(@Param("orderTrackingNumber") String orderTrackingNumber);
}
