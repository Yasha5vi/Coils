package com.coils.demo.config;

import com.coils.demo.entity.Roles;
import com.coils.demo.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        if (!roleRepository.existsByRole("MEMBER")) {
            roleRepository.save(new Roles("MEMBER"));
        }
        if (!roleRepository.existsByRole("RECRUITER")) {
            roleRepository.save(new Roles("RECRUITER"));
        }
    }
}
