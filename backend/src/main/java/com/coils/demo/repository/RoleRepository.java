package com.coils.demo.repository;

import com.coils.demo.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Roles,Integer> {
    Roles findByRole(String role);
}
