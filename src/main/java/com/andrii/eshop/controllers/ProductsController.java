package com.andrii.eshop.controllers;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/products")
@CrossOrigin("*")
public class ProductsController {

    public final ProductService service;

    @Autowired
    public ProductsController(ProductService productService) {
        this.service = productService;
    }

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        @RequestParam(defaultValue = "id") String sort
//                                        @RequestParam(defaultValue = "ascending") String order // TODO: implement later -> changing order
    ) {
        return service.findAllProducts(page, size, sort);
    }

    @GetMapping("/{product_id}")
    public Product getProduct(@PathVariable int product_id) {
        return service.findProductById(product_id);
    }

    @PostMapping(value = "/add-product",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity addNewProduct(@RequestParam String name,
                                        @RequestParam double price,
                                        @RequestParam int quantity,
                                        @RequestParam String description,
                                        @RequestParam List<MultipartFile> files) {
        Product product = new Product(name,price,quantity,description);
        service.addNewProduct(product);
        System.out.println(product.getId());
        files.forEach(file -> service.uploadProductImage(product.getId(), file));
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }


    @PutMapping("/{product_id}")
    public void updateProduct(@PathVariable int product_id) {
        // TODO: implement call to service for updating the product by id
    }

    @DeleteMapping("/{product_id}")
    public void deleteProduct(@PathVariable long product_id) {
        service.deleteProductById(product_id);
    }

    @PostMapping(
            value = "/{productId}/product-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity uploadProductImage(@PathVariable long productId,
                                             @RequestParam MultipartFile file) {

        service.uploadProductImage(productId, file);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{productId}/product-image")
    public byte[] getProductImage(@PathVariable long productId) {

        return service.getProductImage(productId);
    }

}