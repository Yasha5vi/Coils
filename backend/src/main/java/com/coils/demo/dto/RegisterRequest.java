package com.coils.demo.dto;

public class RegisterRequest {

    private String username;
    private String password;
    private String role;

    private String email;

    public RegisterRequest(){}

    public RegisterRequest(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String userId) {
        this.username = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}