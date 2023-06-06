package com.andrii.eshop.services;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.repositories.ProductRepository;
import com.andrii.eshop.utils.Util;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Service
public class ProductService {

    private final ProductRepository repository;
    public final ProductImagesService imagesService;

    private final Util util;

    public ProductService(ProductRepository repository, ProductImagesService imagesService, Util util) {
        this.repository = repository;
        this.imagesService = imagesService;
        this.util = util;
    }

    public List<Product> findAllProducts(int page, int size, String sort, String searchQuery) {
        if (searchQuery != null) {
            Sort sortBy = Sort.by(sort);
            PageRequest pageRequest = PageRequest.of(page, size, sortBy);
            return repository.findProductsByNameContainingIgnoreCase(searchQuery, pageRequest).getContent();
        }
        Sort sortBy = Sort.by(sort);
        PageRequest pageRequest = PageRequest.of(page,size,sortBy);
        return repository.findAll(pageRequest).getContent();
    }

    public Product findProductById(long product_id) {
        return util.getProduct(product_id);
    }

    public Product updateProductById(long product_id,
                                     String name,
                                     Double price,
                                     Integer quantity,
                                     String description,
                                     List<MultipartFile> files) {
        Product product = util.getProduct(product_id);
        if (product != null) {
            String currentProductName = product.getName();
            if (name != null) {
                // we store images in the folder named like product,
                // so when user change product name we need to change folder name in the S3 and get new URLs for frontend
                imagesService.replaceImagesToAnotherFolder(currentProductName, name);
                product.setName(name);
                product.setImage(imagesService.getAllProductImageUrls(product_id));
            }
            if (price != null) {
                product.setPrice(price);
            }
            if (quantity != null) {
                product.setQuantity(quantity);
            }
            if (description != null) {
                product.setDescription(description);
            }
            if (files != null) {
                List<String> imageUrls = product.getImage();
                List<String> imageNames = product.getImageNames();
                // if name doesn't change use current name else -> use new one
                String productName = name != null ? name : currentProductName;
                files.forEach(file -> {
                    imageUrls.add(imagesService.updateProductImage(productName, file));
                    imageNames.add(file.getOriginalFilename());
                });
                product.setImageNames(imageNames);
                product.setImage(imageUrls);
            }
            repository.save(product);
        }
        return product;
    }

    public void deleteProductById(long product_id) {
        imagesService.deleteProductFolder(product_id);
        repository.deleteById(product_id);
    }

    public Product addNewProduct(String name, double price, int quantity, String description, List<MultipartFile> files) {
        List<String> imageUrls = new ArrayList<>();
        List<String> imageNames = new ArrayList<>();
        files.forEach(file -> {
            imageNames.add(file.getOriginalFilename());
            imageUrls.add(imagesService.uploadProductImage(name, file));
        });
        Product product = new Product(name, price, quantity, description, imageUrls, imageNames);
        repository.save(product);
        return product;
    }
}
