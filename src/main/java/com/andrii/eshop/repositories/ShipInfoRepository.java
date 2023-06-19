package com.andrii.eshop.repositories;

import com.andrii.eshop.models.orders.ShipInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipInfoRepository extends JpaRepository<ShipInfo, Integer> {
}
