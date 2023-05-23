package com.andrii.eshop.utils;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.repositories.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class Util {

    final ProductRepository repository;

    public Util(ProductRepository repository) {
        this.repository = repository;
    }

    public Product getProduct(Long productId) {
        Product product;
        if(repository.existsById(productId))
            product = repository.findById(productId).get();
        else
            return null;
        return product;
    }
}
