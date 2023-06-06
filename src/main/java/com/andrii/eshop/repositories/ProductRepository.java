package com.andrii.eshop.repositories;

import com.andrii.eshop.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findProductsByNameContainingIgnoreCase (String searchQuery, Pageable pageable);
}
