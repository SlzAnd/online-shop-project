package com.andrii.eshop.services;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.repositories.ProductRepository;
import com.andrii.eshop.utils.Util;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    public List<Product> findAllProducts(int page, int size, String sort) {
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
                                     String description) {
        Product product = util.getProduct(product_id);
        if (product != null) {
            if (name != null) {
                product.setName(name);
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
            repository.save(product);
        }
        return product;
    }

    public void deleteProductById(long product_id) {
        repository.deleteById(product_id);
    }

    public Product addNewProduct(String name, double price, int quantity, String description, List<MultipartFile> files) {
        List<String> imageNames = files.stream()
                .map(MultipartFile::getOriginalFilename)
                .toList();
        Product product = new Product(name, price, quantity, description, imageNames);
        repository.save(product);
        files.forEach(file -> imagesService.uploadProductImage(product.getId(), file));
        return product;
    }


}
