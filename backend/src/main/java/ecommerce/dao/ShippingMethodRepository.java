package ecommerce.dao;

import ecommerce.entity.ShippingMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.UUID;

@RepositoryRestResource
public interface ShippingMethodRepository extends JpaRepository<ShippingMethod, UUID>{
}
