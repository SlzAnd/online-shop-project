package com.andrii.eshop.repositories;

import com.andrii.eshop.models.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    List<User> findAllByEmailContainingIgnoreCase(String email);
    List<User> findAllByPhoneNumberContainingIgnoreCase(String phoneNumber);

    List<User> findAllByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String lastName, String firstName, String email);

}
