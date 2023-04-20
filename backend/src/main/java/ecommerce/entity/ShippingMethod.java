package ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "shipping_method")
@Getter
@Setter
public class ShippingMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;
    @Column(name = "name")
    private String name;
    @Column(name = "price")
    private BigDecimal price;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "shippingMethod")
    private Set<Order> orders = new HashSet<>();
}
