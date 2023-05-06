package com.andrii.eshop;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.repositories.ProductRepository;
import com.andrii.eshop.s3.S3Buckets;
import com.andrii.eshop.s3.S3Service;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Main {

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}


	@Bean
	CommandLineRunner runner(S3Service s3Service, S3Buckets s3Buckets, ProductRepository repository) {
		return args -> {
//			repository.save(new Product("Pride rox tour",
//					30000.0, 1, "new bycicle, gray color"));
//			repository.save(new Product("Merida silex",
//					65000.0, 1, "new bycicle, white color"));
//			repository.save(new Product("Cannondale e-bike",
//					130000.0, 1, "new bike, coyote color"));


//			s3Service.uploadImage(s3Buckets.getProductImages(),
//					"test",
//					"Hello bucket!".getBytes());
//
//			byte[] obj = s3Service.downloadImage(s3Buckets.getProductImages(), "test");
//			System.out.println("Downloaded from bucket: " + new String(obj));
		};
	}
}
