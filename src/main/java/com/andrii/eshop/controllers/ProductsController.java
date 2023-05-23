package com.andrii.eshop.controllers;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.services.ProductImagesService;
import com.andrii.eshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/products")
@CrossOrigin("*")
public class ProductsController {

    public final ProductService service;
    public final ProductImagesService imagesService;


    @Autowired
    public ProductsController(ProductService productService, ProductImagesService imagesService) {
        this.service = productService;
        this.imagesService = imagesService;
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
    public ResponseEntity<Product> getProduct(@PathVariable int product_id) {
        Product product = service.findProductById(product_id);
        if (product != null)
            return ResponseEntity.ok(product);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }


    @PostMapping(value = "/add-product",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Product> addNewProduct(@RequestParam String name,
                                        @RequestParam double price,
                                        @RequestParam int quantity,
                                        @RequestParam String description,
                                        @RequestParam List<MultipartFile> files) {

        Product product = service.addNewProduct(name, price, quantity, description, files);
        if (product != null)
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }


    @PutMapping("/{product_id}")
    public ResponseEntity<Object> updateProduct(@PathVariable int product_id,
                                                 @RequestParam(required = false) String name,
                                                 @RequestParam(required = false) Double price,
                                                 @RequestParam(required = false) Integer quantity,
                                                 @RequestParam(required = false) String description) {
        Product product = service.updateProductById(product_id, name, price, quantity, description);
        if (product != null)
            return ResponseEntity.ok(product);
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product with id=" + product_id + " wasn't found");
    }


    @DeleteMapping("/{product_id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable long product_id) {
        service.deleteProductById(product_id);
        return ResponseEntity.ok().build();
    }




}
