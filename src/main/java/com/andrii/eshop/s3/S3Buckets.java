package com.andrii.eshop.s3;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "aws.s3.buckets")
public class S3Buckets {

    private String productImagesBucket;

    public String getProductImagesBucket() {
        return productImagesBucket;
    }

    public void setProductImagesBucket(String productImages) {
        this.productImagesBucket = productImages;
    }
}
