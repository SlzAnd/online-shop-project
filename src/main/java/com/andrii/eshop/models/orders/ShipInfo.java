package com.andrii.eshop.models.orders;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
public class ShipInfo {

    public ShipInfo(ShippingType shippingType,
                    String country,
                    String region,
                    String city,
                    int warehouseNumber
                    ) {
        this.shippingType = shippingType;
        this.country = country;
        this.region = region;
        this.city = city;
        this.warehouseNumber = warehouseNumber;
    }

    @Id
    @GeneratedValue
    private Integer id;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private ShippingType shippingType;

    @Getter
    @Setter
    private String country;

    @Getter
    @Setter
    private String region;

    @Getter
    @Setter
    private String city;

    @Getter
    @Setter
    private int warehouseNumber;

//    @OneToOne
//    @JoinColumn(name = "orders_id")
//    private Order order;

}
