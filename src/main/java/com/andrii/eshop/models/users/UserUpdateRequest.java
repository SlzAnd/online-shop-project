package com.andrii.eshop.models.users;

public record UserUpdateRequest(String firstName, String lastName, String email, String phoneNumber) {
}
