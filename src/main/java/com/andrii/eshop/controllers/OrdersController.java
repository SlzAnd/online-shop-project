package com.andrii.eshop.controllers;

import com.andrii.eshop.config.OrderUpdateHandler;
import com.andrii.eshop.models.orders.OrderRequest;
import com.andrii.eshop.models.orders.OrderResponse;
import com.andrii.eshop.services.OrdersService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.WebSocketHandler;

import java.util.List;

@RestController
@RequestMapping("api/orders")
@AllArgsConstructor
public class OrdersController {

    public final OrdersService service;
    public final OrderUpdateHandler orderUpdateHandler;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse orderResponse = service.createOrder(orderRequest);
        orderUpdateHandler.sendUpdateToAllClients(orderResponse);
        return ResponseEntity.ok(orderResponse);
    };


    //TODO: Should be available for admins only
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders() {
        List<OrderResponse> orderResponses = service.getAllOrders();
        return ResponseEntity.ok(orderResponses);
    };


    @GetMapping("/{order_id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable int order_id) {
        OrderResponse orderResponse = service.getOrderById(order_id);
        if (orderResponse != null)
            return ResponseEntity.ok(orderResponse);
        else
            return ResponseEntity.notFound().build();
    };


    //TODO: Should be available for admins only
    @PutMapping("/{order_id}")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable int order_id,
                                                           @RequestParam String newStatus
                                                           ) {
        OrderResponse response = service.updateOrderStatus(order_id, newStatus);

        if(response != null) {
            orderUpdateHandler.sendUpdateToAllClients(response);
            return ResponseEntity.ok(response);
        }
        else
            return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{order_id}")
    public ResponseEntity<OrderResponse> deleteOrder(@PathVariable int order_id) {

        if(service.deleteOrder(order_id))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.badRequest().build();
    }

}
