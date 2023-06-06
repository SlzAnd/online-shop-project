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

    public String uploadProductImage(String productName, MultipartFile file) {
        return uploadFileToBucket(productName, file);
    }

    public String updateProductImage(String productName, MultipartFile file) {
        return uploadFileToBucket(productName, file);
    }

    public List<String> getAllProductImageUrls(Long productId) {
        Product currentProduct = util.getProduct(productId);
        if(currentProduct != null)
            return s3Service.downloadAllUrlsFromBucketFolder(s3Buckets.getProductImagesBucketName(),
                    currentProduct.getName());
        else return null;
    }

    public void deleteProductImage(long productId, String imageName) {
        Product currentProduct = util.getProduct(productId);

        List<String> imageNames = currentProduct.getImageNames();
        imageNames.remove(imageName);
        currentProduct.setImageNames(imageNames);

        List<String> imageUrls = currentProduct.getImage();
        String imageNameWithoutSpaces = imageName.replaceAll(" ", "%20");
        System.out.println("ImageNameWith%20: " + imageNameWithoutSpaces);
        imageUrls.removeIf(url -> url.endsWith(imageNameWithoutSpaces));
        System.out.println(imageUrls);
        currentProduct.setImage(imageUrls);

        repository.save(currentProduct);
        s3Service.deleteFileFromBucket(s3Buckets.getProductImagesBucketName(), currentProduct.getName(), imageName);
    }

    public void deleteProductFolder(long productId) {
        Product currentProduct = util.getProduct(productId);
        s3Service.deleteFolderFromBucket(s3Buckets.getProductImagesBucketName(), currentProduct.getName());
    }

    public void replaceImagesToAnotherFolder(String currentFolder, String destinationFolder) {
        s3Service.replaceFilesToAnotherFolder(currentFolder, destinationFolder, s3Buckets.getProductImagesBucketName());
    }

    private String uploadFileToBucket(String productName, MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String bucketName = s3Buckets.getProductImagesBucketName();
        String path = String.format("%s/%s", productName, fileName); //bucketName/productFolder/product images

        try {
            return s3Service.uploadFileToBucket(bucketName, path, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
