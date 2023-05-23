package com.andrii.eshop.controllers;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.services.ProductImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/products")
@CrossOrigin("*")
public class ProductImagesController {

    public final ProductImagesService imagesService;

    @Autowired
    public ProductImagesController(ProductImagesService imagesService) {
        this.imagesService = imagesService;
    }

    @PostMapping(
            value = "/{productId}/product-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> addProductImage(@PathVariable long productId,
                                                @RequestParam MultipartFile file) {
        Product product = imagesService.updateProductImage(productId, file);
        if (product != null)
            return ResponseEntity.ok(product);
        else return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{productId}/product-image")
    public ResponseEntity<List<String>> getProductImage(@PathVariable long productId) {
        List<String> images = imagesService.getAllProductImageUrls(productId);
        if (images == null)
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.ok().body(images);
    }

    @DeleteMapping("/{productId}/product-image")
    public ResponseEntity<?> deleteProductImage(@PathVariable long productId,@RequestParam String imageName) {
        imagesService.deleteProductImage(productId, imageName);
        return ResponseEntity.ok().build();
    }
}
