package com.andrii.eshop.repositories;

import com.andrii.eshop.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
