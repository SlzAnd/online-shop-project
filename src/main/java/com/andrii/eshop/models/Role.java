package com.andrii.eshop.models;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.andrii.eshop.models.Permission.*;

@RequiredArgsConstructor
public enum Role {

    USER(
        Set.of(
            PRODUCT_READ
        )
    ),
    ADMIN(
        Set.of(
            PRODUCT_CREATE,
            PRODUCT_READ,
            PRODUCT_UPDATE,
            PRODUCT_DELETE
        )
    );

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    };
}