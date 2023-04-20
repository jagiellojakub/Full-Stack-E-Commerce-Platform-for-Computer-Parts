package ecommerce.dao;

import ecommerce.entity.Customer;
import ecommerce.projections.CustomerWithoutOrders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.UUID;

@RepositoryRestResource(excerptProjection = CustomerWithoutOrders.class)
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Customer findByEmail(String email);


}
