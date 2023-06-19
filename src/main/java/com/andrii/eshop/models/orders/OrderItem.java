package com.andrii.eshop.models.orders;

import com.andrii.eshop.models.Product;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;

//    @ManyToOne
//    @JoinColumn(name = "order_id")
//    private Order order;

}
