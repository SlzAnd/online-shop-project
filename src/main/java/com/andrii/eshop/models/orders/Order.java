package com.andrii.eshop.models.orders;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import static jakarta.persistence.GenerationType.SEQUENCE;


@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "_order")
public class Order {

    public Order(double price,
                 LocalDateTime created,
                 UserInfo customer,
                 List<OrderItem> items,
                 ShipInfo shipInfo,
                 OrderStatus orderStatus
                 ) {
        this.price = price;
        this.created = created;
        this.customer = customer;
        this.items = items;
        this.shipInfo = shipInfo;
        this.status = orderStatus;
    }

    @Id
    @SequenceGenerator(
            name = "order_sequence",
            sequenceName = "order_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = SEQUENCE,
            generator = "order_sequence"
    )
    private Long id;

    @Column(nullable = false)
    private double price;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private LocalDateTime created;

    @ManyToOne
    @JoinColumn(name = "user_info_id", nullable = false)
    private UserInfo customer;

    @OneToMany
    @JoinColumn(name = "order_item_id")
    private List<OrderItem> items;

    @OneToOne
    @JoinColumn(name = "ship_info_id", nullable = false)
    private ShipInfo shipInfo;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

}
