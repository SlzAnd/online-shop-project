package com.andrii.eshop.controllers;

import com.andrii.eshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/products")
@CrossOrigin("*")
public class ProductImagesController {

    public final ProductService service;

    @Autowired
    public ProductImagesController(ProductService productService) {
        this.service = productService;
    }

    @PostMapping(
            value = "/{productId}/product-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadProductImage(@PathVariable long productId,
                                                @RequestParam MultipartFile file) {

        service.uploadProductImage(productId, file);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{productId}/product-image")
    public byte[] getProductImage(@PathVariable long productId) {

        return service.getProductImage(productId);
    }
}
