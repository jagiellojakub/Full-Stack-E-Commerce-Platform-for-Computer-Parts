package ecommerce.projections;

import ecommerce.entity.Customer;
import lombok.Data;
import org.springframework.data.rest.core.config.Projection;

import java.util.UUID;

@Projection(name = "customerWithoutOrders", types = { Customer.class })
public interface CustomerWithoutOrders {
    UUID getId();
    String getFirstName();
    String getLastName();
    String getEmail();
}
