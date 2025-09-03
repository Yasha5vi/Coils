
package com.coils.demo.service;

import com.coils.demo.dto.AuthenticationRequest;
import com.coils.demo.dto.AuthenticationResponse;
import com.coils.demo.dto.RegisterRequest;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request);
    AuthenticationResponse login(AuthenticationRequest request);
}
