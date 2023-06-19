package com.andrii.eshop.models.orders;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShipInfo {

    @Id
    @GeneratedValue
    private Integer id;

    @Enumerated(EnumType.STRING)
    private ShippingType shippingType;

    private String country;

    private String region;

    private String city;

    private int warehouseNumber;

//    @OneToOne
//    @JoinColumn(name = "orders_id")
//    private Order order;

}
