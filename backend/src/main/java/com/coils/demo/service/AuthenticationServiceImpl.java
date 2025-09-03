package com.coils.demo.service;

import com.coils.demo.Util.JwtUtil;
import com.coils.demo.dto.AuthenticationRequest;
import com.coils.demo.dto.AuthenticationResponse;
import com.coils.demo.dto.RegisterRequest;
import com.coils.demo.entity.Profile;
import com.coils.demo.entity.User;
import com.coils.demo.entity.Roles;
import com.coils.demo.repository.RoleRepository;
import com.coils.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository rolesRepository;

    @Autowired
    public AuthenticationServiceImpl(
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthenticationResponse register(RegisterRequest request) {

        // Save Member
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Profile profile = new Profile();
        profile.setCoilsHandle(request.getUsername());
        profile.setEmail(request.getEmail());

        profile.setUser(user);
        user.setProfile(profile);

        List<String> requestRoles = new ArrayList<>();
        requestRoles.add("MEMBER");

        List<Roles> roles = new ArrayList<>();
        for(String roleName: requestRoles){
            Roles role = rolesRepository.findByRole(roleName);
            if(role != null){
                roles.add(role);
            }
        }

        user.setRoles(roles);

        userRepository.save(user);

        // Create token
        String token = jwtUtil.generateToken(request.getUsername(), requestRoles);
        return new AuthenticationResponse(token,user.getProfile());
    }

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.startsWith("ROLE_") ? role.substring(5) : role)
                .toList();

        String token = jwtUtil.generateToken(userDetails.getUsername(), roles);

        Optional<User> opt = userRepository.findByUsername(request.getUsername());
        Profile profile = null;
        if(opt.isPresent()){
            User user = opt.get();
            profile = user.getProfile();
        }

        return new AuthenticationResponse(token,profile);
    }

}