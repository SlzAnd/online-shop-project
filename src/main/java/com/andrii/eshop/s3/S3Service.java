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
import java.util.stream.Collectors;

@Service
public class S3Service {

    private final S3Client s3Client;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFileToBucket(String bucketName, String path, byte[] file) {
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(path)
                .build();


        s3Client.putObject(objectRequest, RequestBody.fromBytes(file));

        return s3Client.utilities().getUrl(GetUrlRequest.builder()
                .bucket(bucketName)
                .key(path)
                .build()).toString();
    }

    public void replaceFilesToAnotherFolder(String currentFolder, String destinationFolder, String bucketName) {
        try {
            ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix(currentFolder + "/")
                    .build();
            ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);
            List<S3Object> objects = listResponse.contents();

            for (S3Object object : objects) {
                String sourceKey = object.key();
                String destinationKey = sourceKey.replace(currentFolder, destinationFolder);

                CopyObjectRequest copyRequest = CopyObjectRequest.builder()
                        .sourceBucket(bucketName)
                        .sourceKey(sourceKey)
                        .destinationBucket(bucketName)
                        .destinationKey(destinationKey)
                        .build();

                s3Client.copyObject(copyRequest);
            }

            deleteFolderFromBucket(bucketName, currentFolder);

        } catch (S3Exception e) {
            throw new RuntimeException(e);
        }
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

    public List<String> downloadAllUrlsFromBucketFolder(String bucketName, String folderName) {
        List<String> imageURLs = new ArrayList<>();
        try {
            ListObjectsRequest listRequest = ListObjectsRequest
                    .builder()
                    .bucket(bucketName)
                    .build();

            ListObjectsResponse response = s3Client.listObjects(listRequest);
            List<S3Object> objects = response.contents();

            for (S3Object object : objects) {
                if (object.key().startsWith(folderName)) {
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

    public void deleteFolderFromBucket(String bucketName, String folderName) {
        try {
            ListObjectsV2Request listObjectsRequest = ListObjectsV2Request.builder().bucket(bucketName).prefix(folderName).build();
            ListObjectsV2Response listObjectsResponse = s3Client.listObjectsV2(listObjectsRequest);
            List<S3Object> objectsToDelete = listObjectsResponse.contents();
            if (!objectsToDelete.isEmpty()) {
                DeleteObjectsRequest deleteObjectsRequest = DeleteObjectsRequest.builder()
                        .bucket(bucketName)
                        .delete(Delete.builder()
                                .objects(objectsToDelete.stream()
                                    .map(s3Object -> ObjectIdentifier.builder().key(s3Object.key()).build())
                                    .collect(Collectors.toList()))
                                .build()
                        )
                        .build();
                DeleteObjectsResponse deleteObjectsResponse = s3Client.deleteObjects(deleteObjectsRequest);
                System.out.println("Deleted objects:");
                deleteObjectsResponse.deleted().forEach(System.out::println);
            }
        } catch (S3Exception e) {
            throw new RuntimeException(e);
        }
    }
}
