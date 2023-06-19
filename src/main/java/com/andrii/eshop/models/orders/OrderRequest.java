package com.andrii.eshop.models.orders;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

    private UserInfo user;
    private Address address;
    private List<Item> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Address {
        private String shippingType;
        private String country;
        private String region;
        private String city;
        private int warehouseNumber;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Item {
        private Long product_id;
        private int quantity;
    }

}
