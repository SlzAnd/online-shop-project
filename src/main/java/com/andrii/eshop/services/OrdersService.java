package com.andrii.eshop.services;

import com.andrii.eshop.models.Product;
import com.andrii.eshop.models.orders.*;
import com.andrii.eshop.repositories.OrderItemRepository;
import com.andrii.eshop.repositories.OrderRepository;
import com.andrii.eshop.repositories.ShipInfoRepository;
import com.andrii.eshop.repositories.UserInfoRepository;
import com.andrii.eshop.utils.Util;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrdersService {

    private final Util util;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserInfoRepository userInfoRepository;
    private final ShipInfoRepository shipInfoRepository;
    private final DateTimeFormatter dateTimeFormatter;

    public OrdersService(Util util, OrderRepository repository,
                         OrderItemRepository orderItemRepository,
                         UserInfoRepository userInfoRepository,
                         ShipInfoRepository shipInfoRepository
    ) {
        this.util = util;
        this.orderRepository = repository;
        this.orderItemRepository = orderItemRepository;
        this.userInfoRepository = userInfoRepository;
        this.shipInfoRepository = shipInfoRepository;
        this.dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> orderResponses = new ArrayList<>();
        for(Order order : orders) {
            List<OrderResponse.Item> items = createOrderItemsForResponse(order);

            OrderResponse orderResponse = createOrderResponse(order, items);
            orderResponses.add(orderResponse);
        }
        return orderResponses;
    }



    public OrderResponse createOrder(OrderRequest orderRequest) {

        // create order items using info from request. Find product in our database -> set needed quantity
        List<OrderItem> orderItems = orderRequest.getItems().stream().map(item -> {
            Product product = util.getProduct(item.getProduct_id());
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .price(product.getPrice())
                    .quantity(item.getQuantity())
                    .build();
            orderItemRepository.save(orderItem); // save in the DB
            return orderItem;
        }).toList();

        // count the sum of all product's prices in this order
        double sumPrice = orderItems.stream()
                .mapToDouble(orderItem -> orderItem.getPrice() * orderItem.getQuantity())
                .sum();

        // found the shipping type (Nova Post, Ukr Post, Mist Express or Self pickup if nothing didn't type)
        ShippingType shippingType = detectShippingType(orderRequest.getAddress().getShippingType());

        // create ship info object with all necessary info and save in the DB
        ShipInfo shipInfo = new ShipInfo(
                shippingType,
                orderRequest.getAddress().getCountry(),
                orderRequest.getAddress().getRegion(),
                orderRequest.getAddress().getCity(),
                orderRequest.getAddress().getWarehouseNumber()
        );

        shipInfoRepository.save(shipInfo);

        // get user info and save this object in the DB
        UserInfo userInfo = orderRequest.getUser();
        userInfoRepository.save(userInfo);

        // create order object
        Order order = new Order(
                sumPrice, //price
                LocalDateTime.now(), //created
                userInfo, //customer
                orderItems, //items
                shipInfo, //shipInfo
                OrderStatus.CREATED //status
                );


        // store order object in the DB
        orderRepository.save(order);

        List<OrderResponse.Item> items = createOrderItemsForResponse(order);

        return createOrderResponse(order, items);
    }

    private List<OrderResponse.Item> createOrderItemsForResponse(Order order) {
        return order.getItems().stream()
                .map(orderItem -> new OrderResponse.Item(orderItem.getProduct().getId(),
                        orderItem.getProduct().getName(),
                        orderItem.getProduct().getPrice(),
                        orderItem.getQuantity()
                )).toList();
    }

    private OrderResponse createOrderResponse(Order order, List<OrderResponse.Item> items) {
        return OrderResponse.builder()
                .id(order.getId())
                .totalPrice(order.getPrice())
                .created(order.getCreated().format(dateTimeFormatter))
                .status(order.getStatus())
                .userInfo(order.getCustomer())
                .shipInfo(order.getShipInfo())
                .orderItems(items)
                .build();
    }

    private ShippingType detectShippingType(String shippingType) {
        return switch (shippingType) {
            case "NOVA_POST" -> ShippingType.NOVA_POST;
            case "UKR_POST" -> ShippingType.UKR_POST;
            case "MIST_EXPRESS" -> ShippingType.MIST_EXPRESS;
            default -> ShippingType.SELF_PICKUP;
        };
    }

    private OrderStatus detectOrderStatus(String status) {
        return switch (status) {
            case "CREATED" -> OrderStatus.CREATED;
            case "IN_PROGRESS" -> OrderStatus.IN_PROGRESS;
            case "SHIPPED" -> OrderStatus.SHIPPED;
            default -> OrderStatus.CANCELLED;
        };
    }

    public OrderResponse getOrderById(long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);

        OrderResponse response = null;
        if (order != null) {
            List<OrderResponse.Item> items = createOrderItemsForResponse(order);
            response = createOrderResponse(order, items);
        }

        return response;
    }

    public OrderResponse updateOrderStatus(long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId).orElse(null);

        OrderResponse response = null;
        if (order != null) {
            order.setStatus(detectOrderStatus(newStatus));
            orderRepository.save(order);
            List<OrderResponse.Item> items = createOrderItemsForResponse(order);
            response = createOrderResponse(order, items);
        }

        return response;
    }

    public boolean deleteOrder(long orderId) {
        if (orderRepository.existsById(orderId)) {
            orderRepository.deleteById(orderId);
            return true;
        }
        return false;
    }
}
