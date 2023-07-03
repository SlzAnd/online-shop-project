package com.andrii.eshop.models.users;

import com.andrii.eshop.models.auth.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private final int id;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String phoneNumber;
    private final Role role;
    public UserResponse(int id, String firstName, String lastName, String email, String phoneNumber, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;

        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    public UserResponse(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole();
    }
};
