
package com.coils.demo.Security;

import com.coils.demo.Util.JwtUtil;
import com.coils.demo.config.JwtProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil, JwtProperties jwtProperties) {
        this.jwtUtil = jwtUtil;
        this.jwtProperties = jwtProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        // Step 1: Extract Authorization header
        final String authHeader = request.getHeader(jwtProperties.getHeader());

        String username = null;
        String jwtToken = null;

        // Step 2: Check header starts with prefix like "Bearer "
        if (authHeader != null && authHeader.startsWith(jwtProperties.getPrefix())) {
            jwtToken = authHeader.substring(jwtProperties.getPrefix().length()).trim();

            // If token is missing after "Bearer", ignore and continue unauthenticated
            if (!jwtToken.isBlank()) {
                try {
                    username = jwtUtil.extractUsername(jwtToken);
                } catch (Exception e) {
                    // Invalid token: do not crash filter chain, just ignore auth
                    username = null;
                }
            }
        }

        // Step 3: Set SecurityContext if token is valid
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwtToken)) {
                List<String> roles = jwtUtil.extractRoles(jwtToken);
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
//                System.out.println("Authentication set: " + SecurityContextHolder.getContext().getAuthentication());
            }
        }
        // Step 4: Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
