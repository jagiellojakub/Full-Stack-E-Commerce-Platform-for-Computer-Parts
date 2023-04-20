package ecommerce.dao;

import ecommerce.entity.OrderItem;
import ecommerce.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.UUID;

@CrossOrigin("https://localhost:4200")
@RepositoryRestResource
public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {
    List<UserAddress> findByEmailOrderByIsDefaultDesc(@Param("email") String email);
    List<UserAddress> findByEmailAndIsDefault(@Param("email") String email, boolean isDefault);
}
