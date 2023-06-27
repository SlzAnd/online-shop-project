package com.andrii.eshop.controllers;

import com.andrii.eshop.models.auth.Role;
import com.andrii.eshop.models.users.UserResponse;
import com.andrii.eshop.models.users.UserUpdateRequest;
import com.andrii.eshop.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    public final UserService service;

    public UsersController(UserService service) {
        this.service = service;
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsers(
            @RequestParam(name = "search", required = false) String searchQuery
    ) {
        List<UserResponse> users = service.getAllUsers(searchQuery);
        if (users != null)
            return ResponseEntity.ok(users);
        else
            return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserResponse> updateUser( @PathVariable int id,
        @RequestBody UserUpdateRequest userUpdateRequest
    ) {
        UserResponse updatedUser = service.updateUserProfile(id, userUpdateRequest);

        if(updatedUser != null)
            return ResponseEntity.ok(updatedUser);
        else
            return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/changeRole")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> changeRole(@PathVariable int id,
                                             @RequestBody Role role) {
        if(service.changeUserRole(id, role)) {
            return ResponseEntity.ok("Role for user: " + id + " was changed to: " + role);
        } else
            return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        if(service.deleteUser(id))
            return ResponseEntity.ok("User was successfully deleted!");
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with id:" + id + " was not found!");
    }
}
