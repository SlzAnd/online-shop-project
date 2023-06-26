package com.andrii.eshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    public final WebSocketHandler orderUpdateHandler;

    public WebSocketConfig(WebSocketHandler orderUpdateHandler) {
        this.orderUpdateHandler = orderUpdateHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(orderUpdateHandler, "/api/orders/stream").setAllowedOrigins("*");
    }
}


