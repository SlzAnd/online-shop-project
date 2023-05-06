package com.andrii.eshop.services;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.repositories.ProductRepository;
import com.andrii.eshop.s3.S3Buckets;
import com.andrii.eshop.s3.S3Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository repository;

    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    public ProductService(ProductRepository repository, S3Service s3Service, S3Buckets s3Buckets) {
        this.repository = repository;
        this.s3Service = s3Service;
        this.s3Buckets = s3Buckets;
    }

    public List<Product> findAllProducts(int page, int size, String sort) {
        Sort sortBy = Sort.by(sort);
        PageRequest pageRequest = PageRequest.of(page,size,sortBy);
        return repository.findAll(pageRequest).getContent();
    }

    public Product findProductById(long product_id) {
        if(repository.findById(product_id).isPresent())
            return repository.findById(product_id).get();
//        else throw new RuntimeException("No product with this product_id");
        else return new Product();
    }

    public Product updateProductById(int product_id) {
        return new Product();
        // TODO: call to repo -> find product by ID -> update product
    }

    public void deleteProductById(long product_id) {
        repository.deleteById(product_id);
        // TODO: call to repo -> find product by ID -> delete this product
    }

    public void addNewProduct(Product product) {
        repository.save(product);
    }

    public void uploadProductImage(long productId, MultipartFile file) {
        Product currentProduct = getProduct(productId);
        String productFolder = String.format("%s-%s", currentProduct.getName(), UUID.randomUUID());
        String bucketName = s3Buckets.getProductImagesBucket();
        String path = String.format("%s/%s", productFolder, file.getOriginalFilename()); //bucketName/productFolder/product images

        try{
            s3Service.uploadImage(bucketName, path, file.getBytes());
            currentProduct.setImageFolder(productFolder);
            repository.save(currentProduct);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        
    }

    public byte[] getProductImage(Long productId) {
        Product currentProduct = getProduct(productId);
        return s3Service.downloadImage(s3Buckets.getProductImagesBucket(), currentProduct.getImageFolder());
    }

    private Product getProduct(Long productId) {
        Product product;
        if(repository.findById(productId).isPresent())
            product = repository.findById(productId).get();
        else
            throw new IllegalArgumentException("No product with this productId");
        return product;
    }
}
