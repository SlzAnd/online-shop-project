package com.andrii.eshop.models.orders;

import com.andrii.eshop.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private double totalPrice;
    private String created;
    private UserInfo userInfo;
    private ShipInfo shipInfo;
    private List<Item> orderItems;

    @Data
    @AllArgsConstructor
    public static class Item {
        private Long product_id;
        private String product_name;
        private double price_per_one;
        private int quantity;
    }
}
