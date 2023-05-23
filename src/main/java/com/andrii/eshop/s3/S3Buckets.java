package com.andrii.eshop.s3;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "aws.s3.buckets")
public class S3Buckets {

    private String productImagesBucketName;

    public String getProductImagesBucketName() {
        return productImagesBucketName;
    }

    public void setProductImagesBucketName(String productImages) {
        this.productImagesBucketName = productImages;
    }
}
