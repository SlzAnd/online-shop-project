package com.andrii.eshop.repositories;

import com.andrii.eshop.models.orders.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
