package com.andrii.eshop.controllers;

import com.andrii.eshop.auth.AuthenticationRequest;
import com.andrii.eshop.auth.AuthenticationResponse;
import com.andrii.eshop.auth.RegisterRequest;
import com.andrii.eshop.models.users.UserResponse;
import com.andrii.eshop.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register (
            @RequestBody RegisterRequest request
     ) {
        return ResponseEntity.ok(service.registerUser(request));
    }

    @PostMapping("/register-admin")
    @PreAuthorize("hasAuthority('user:create')")
    public ResponseEntity<UserResponse> registerAdmin (
            @RequestBody RegisterRequest request
     ) {
        return ResponseEntity.ok(service.registerAdmin(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate (
            @RequestBody AuthenticationRequest request
     ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

}
