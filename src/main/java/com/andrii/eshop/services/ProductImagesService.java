package com.andrii.eshop.services;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.repositories.ProductRepository;
import com.andrii.eshop.s3.S3Buckets;
import com.andrii.eshop.s3.S3Service;
import com.andrii.eshop.utils.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductImagesService {
    private final S3Buckets s3Buckets;
    private final S3Service s3Service;
    private final ProductRepository repository;
    private final Util util;

    @Autowired
    public ProductImagesService(S3Buckets s3Buckets,
                                S3Service s3Service,
                                ProductRepository repository, Util util) {
        this.s3Buckets = s3Buckets;
        this.s3Service = s3Service;
        this.repository = repository;
        this.util = util;
    }

    public void uploadProductImage(long productId, MultipartFile file) {
        uploadFileToBucket(productId, file);
    }

    public Product updateProductImage(long productId, MultipartFile file) {
            Product currentProduct = uploadFileToBucket(productId, file);
            if( currentProduct != null) {
                List<String> imageNames = currentProduct.getImage();
                imageNames.add(file.getOriginalFilename());
                currentProduct.setImage(imageNames);
                repository.save(currentProduct);
                return currentProduct;
            } else
                return null;
    }

    public List<String> getAllProductImageUrls(Long productId) {
        Product currentProduct = util.getProduct(productId);
        if(currentProduct != null)
            return s3Service.downloadAllUrlsFromBucketFolder(s3Buckets.getProductImagesBucketName(), currentProduct.getName());
        else return null;
    }

    public void deleteProductImage(long productId, String imageName) { //TODO: Maybe change image name parameter to number or something simpler
        Product currentProduct = util.getProduct(productId);
        List<String> imageNames = currentProduct.getImage();
        imageNames.remove(imageName);
        currentProduct.setImage(imageNames);
        repository.save(currentProduct);
        s3Service.deleteFileFromBucket(s3Buckets.getProductImagesBucketName(), currentProduct.getName(), imageName);
    }

    private Product uploadFileToBucket(long productId, MultipartFile file) {
        Product currentProduct = util.getProduct(productId);

        if (currentProduct != null) {
            String fileName = file.getOriginalFilename();
            String productFolder = currentProduct.getName();
            String bucketName = s3Buckets.getProductImagesBucketName();
            String path = String.format("%s/%s", productFolder, fileName); //bucketName/productFolder/product images
            try {
                s3Service.uploadFileToBucket(bucketName, path, file.getBytes());
                return currentProduct;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }else return null;
    }
}
