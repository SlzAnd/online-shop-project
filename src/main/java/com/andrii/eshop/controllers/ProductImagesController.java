package com.andrii.eshop.controllers;

import com.andrii.eshop.services.ProductImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/products")
public class ProductImagesController {

    public final ProductImagesService imagesService;

    @Autowired
    public ProductImagesController(ProductImagesService imagesService) {
        this.imagesService = imagesService;
    }

    @GetMapping("/{productId}/product-image")
    @PreAuthorize("hasAuthority('product:read')")
    public ResponseEntity<List<String>> getProductImages(@PathVariable long productId) {
        List<String> images = imagesService.getAllProductImageUrls(productId);
        if (images == null)
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.ok().body(images);
    }

    @DeleteMapping("/{productId}/product-image")
    @PreAuthorize("hasAuthority('product:delete')")
    public ResponseEntity<?> deleteProductImage(@PathVariable long productId,@RequestParam String imageName) {
        imagesService.deleteProductImage(productId, imageName);
        return ResponseEntity.ok().build();
    }
}
