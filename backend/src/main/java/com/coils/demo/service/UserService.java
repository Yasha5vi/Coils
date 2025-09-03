package com.coils.demo.service;

import com.coils.demo.entity.User;

import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    Optional<User> getUserByUsername(String username);
}
