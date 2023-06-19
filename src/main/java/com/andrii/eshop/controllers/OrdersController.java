package com.andrii.eshop.controllers;

import com.andrii.eshop.models.orders.Order;
import com.andrii.eshop.models.orders.OrderRequest;
import com.andrii.eshop.models.orders.OrderResponse;
import com.andrii.eshop.services.OrdersService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/orders")
@AllArgsConstructor
public class OrdersController {

    public final OrdersService service;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse orderResponse = service.createOrder(orderRequest);
        return ResponseEntity.ok(orderResponse);
    };

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders() {
        List<OrderResponse> orderResponses = service.getAllOrders();
        return ResponseEntity.ok(orderResponses);
    };

}
