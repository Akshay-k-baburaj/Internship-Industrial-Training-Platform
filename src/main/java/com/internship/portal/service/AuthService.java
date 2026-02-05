package com.internship.portal.service;

import com.internship.portal.dto.AuthResponse;
import com.internship.portal.dto.LoginRequest;
import com.internship.portal.dto.RegisterRequest;
import com.internship.portal.exception.DuplicateResourceException;
import com.internship.portal.security.JwtTokenProvider;
import com.internship.portal.user.User;
import com.internship.portal.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtTokenProvider jwtTokenProvider;
        private final AuthenticationManager authenticationManager;
        private final UserDetailsService userDetailsService;

        @Value("${jwt.expiration}")
        private long jwtExpiration;

        @Autowired
        private com.internship.portal.student.StudentRepository studentRepository;

        public AuthResponse register(RegisterRequest request) {
                log.info("Registering new user with email: {}", request.getEmail());

                // Check if user already exists
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new DuplicateResourceException("User", "email", request.getEmail());
                }

                // Only allow self-registration for students
                if (request.getRole() == null || request.getRole() != com.internship.portal.user.Role.STUDENT) {
                        throw new RuntimeException(
                                        "Only students can self-register. Faculty and placement cell accounts must be created by an admin.");
                }

                // Create new user
                User user = User.builder()
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(com.internship.portal.user.Role.STUDENT)
                                .isActive(true)
                                .isVerified(false)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();

                User savedUser = userRepository.save(user);
                log.info("User registered successfully with ID: {}", savedUser.getId());

                // Create Student profile if role is STUDENT
                if (savedUser.getRole() == com.internship.portal.user.Role.STUDENT) {
                        try {
                                com.internship.portal.student.Student student = com.internship.portal.student.Student
                                                .builder()
                                                .user(savedUser)
                                                .rollNumber("STU" + savedUser.getId())
                                                .fullName(extractNameFromEmail(savedUser.getEmail()))
                                                .department("Not Specified")
                                                .resumeUrl("pending_upload") // Placeholder for NOT NULL constraint
                                                .createdAt(LocalDateTime.now())
                                                .updatedAt(LocalDateTime.now())
                                                .build();
                                studentRepository.save(student);
                                log.info("Student profile created for user ID: {}", savedUser.getId());
                        } catch (Exception e) {
                                System.err.println("FAILED TO SAVE STUDENT PROFILE: " + e.getMessage());
                                e.printStackTrace();
                                log.error("Failed to create student profile: {}", e.getMessage());
                        }
                }

                // Generate tokens
                UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
                String accessToken = jwtTokenProvider.generateToken(userDetails);
                String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .tokenType("Bearer")
                                .userId(savedUser.getId())
                                .email(savedUser.getEmail())
                                .role(savedUser.getRole().name())
                                .expiresIn(jwtExpiration)
                                .build();
        }

        private String extractNameFromEmail(String email) {
                if (email == null || !email.contains("@"))
                        return "New Student";
                String username = email.split("@")[0];
                // Capitalize first letter
                if (username.length() > 0) {
                        return username.substring(0, 1).toUpperCase() + username.substring(1);
                }
                return username;
        }

        public AuthResponse login(LoginRequest request) {
                log.info("User login attempt: {}", request.getEmail());

                // Authenticate user
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                // Get user details
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                User user = userRepository.findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Generate tokens
                String accessToken = jwtTokenProvider.generateToken(userDetails);
                String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

                log.info("User logged in successfully: {}", request.getEmail());

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .tokenType("Bearer")
                                .userId(user.getId())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .expiresIn(jwtExpiration)
                                .build();
        }

        public AuthResponse refreshToken(String refreshToken) {
                log.info("Refreshing token");

                // Extract username from refresh token
                String username = jwtTokenProvider.extractUsername(refreshToken);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Validate refresh token
                if (!jwtTokenProvider.validateToken(refreshToken, userDetails)) {
                        throw new RuntimeException("Invalid refresh token");
                }

                // Generate new access token
                String newAccessToken = jwtTokenProvider.generateToken(userDetails);
                User user = userRepository.findByEmail(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                log.info("Token refreshed successfully for user: {}", username);

                return AuthResponse.builder()
                                .accessToken(newAccessToken)
                                .refreshToken(refreshToken)
                                .tokenType("Bearer")
                                .userId(user.getId())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .expiresIn(jwtExpiration)
                                .build();
        }
}
