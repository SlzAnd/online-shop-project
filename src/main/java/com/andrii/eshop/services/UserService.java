package com.andrii.eshop.services;

import com.andrii.eshop.models.auth.Role;
import com.andrii.eshop.models.users.User;
import com.andrii.eshop.models.users.UserResponse;
import com.andrii.eshop.models.users.UserUpdateRequest;
import com.andrii.eshop.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<UserResponse> getAllUsers(String searchQuery) {
        List<User> users;
        List<UserResponse> userResponses = new ArrayList<>();
        if(searchQuery != null) {
            if (searchQuery.matches("-?\\d+")) { //check if search query is phone number
                users = repository.findAllByPhoneNumberContainingIgnoreCase(searchQuery);
            } else {
                users = repository.findAllByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrEmailContainingIgnoreCase(searchQuery, searchQuery, searchQuery);
            }
        }else
            users = repository.findAll();
        if(!users.isEmpty())
            userResponses = users.stream().map(UserResponse::new).toList();
        return userResponses;
    }

    public UserResponse updateUserProfile(int userId, UserUpdateRequest userUpdateRequest) {
        User currentUser = repository.findById(userId).orElse(null);

        if(currentUser != null) {
            if (userUpdateRequest.firstName() != null)
                currentUser.setFirstName(userUpdateRequest.firstName());
            if (userUpdateRequest.lastName() != null)
                currentUser.setLastName(userUpdateRequest.lastName());
            if (userUpdateRequest.email() != null)
                currentUser.setEmail(userUpdateRequest.email());
            if (userUpdateRequest.phoneNumber() != null)
                currentUser.setPhoneNumber(userUpdateRequest.phoneNumber());
            repository.save(currentUser);
            return new UserResponse(currentUser);
        }
        return null;
    }

    public boolean changeUserRole(int id, Role role) {
        User user = repository.findById(id).orElse(null);
        if (user != null) {
            System.out.println(role);
            user.setRole(role);
            repository.save(user);
            return true;
        } else return false;
    }

    public boolean deleteUser(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        } else return false;
    }
}
