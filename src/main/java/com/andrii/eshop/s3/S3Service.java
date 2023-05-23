package com.andrii.eshop.s3;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class S3Service {

    private final S3Client s3Client;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public void uploadFileToBucket(String bucketName, String key, byte[] file) {
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.putObject(objectRequest, RequestBody.fromBytes(file));
    }

    public byte[] downloadFileFromBucket(String bucketName, String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        ResponseInputStream<GetObjectResponse> res = s3Client.getObject(getObjectRequest);

        try {
            return res.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<String> downloadAllUrlsFromBucketFolder(String bucketName, String key) {
        // Можливо можна використати список імен зображень які ми зберігаємо в БД,
        // щоб не робити зайві запити а просто проходити по списку та повертати посилання на зображення.
        // Але якщо ми будемо змінювати ці імена на щось простіше(номера тощо) тоді залишити цю імплементацію!
        List<String> imageURLs = new ArrayList<>();
        try {
            ListObjectsRequest listRequest = ListObjectsRequest
                    .builder()
                    .bucket(bucketName)
                    .build();

            ListObjectsResponse response = s3Client.listObjects(listRequest);
            List<S3Object> objects = response.contents();

            for (S3Object object : objects) {
                if (object.key().startsWith(key)) {
                    GetUrlRequest request = GetUrlRequest.builder()
                            .bucket(bucketName)
                            .key(object.key())
                            .build();

                    URL url = s3Client.utilities().getUrl(request);
                    imageURLs.add(url.toString());
                }
            }
        } catch (S3Exception e) {
            throw new RuntimeException(e);
        }
            return imageURLs;
    }

    public void deleteFileFromBucket(String bucketName, String folderName, String fileName) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                                .key(folderName+"/"+fileName)
                                        .build();
        DeleteObjectResponse response = s3Client.deleteObject(deleteObjectRequest);
        System.out.println(response);
    }
}
