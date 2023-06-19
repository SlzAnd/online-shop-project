package com.andrii.eshop.repositories;

import com.andrii.eshop.models.orders.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
}
