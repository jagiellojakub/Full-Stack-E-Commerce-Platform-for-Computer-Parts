package ecommerce.dao;

import ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


import java.util.UUID;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query("SELECT p FROM Product p WHERE p.category.id = :id OR p.category.parent.id = :id")
    Page<Product> findByCategoryIdOrParentCategoryId(@Param("id") UUID id, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);
}

