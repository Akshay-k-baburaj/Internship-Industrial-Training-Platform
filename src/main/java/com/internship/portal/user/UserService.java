package com.internship.portal.user;

import com.internship.portal.exception.DuplicateResourceException;
import com.internship.portal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(Long id) {
        log.debug("Fetching user by ID: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public User getUserByEmail(String email) {
        log.debug("Fetching user by email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public User createUser(User user) {
        log.info("Creating new user with email: {}", user.getEmail());

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User", "email", user.getEmail());
        }

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    public User updateUser(Long id, User user) {
        log.info("Updating user with ID: {}", id);

        User existing = getUserById(id);

        // Check if email is being changed and if it's already taken
        if (!existing.getEmail().equals(user.getEmail()) &&
                userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User", "email", user.getEmail());
        }

        existing.setEmail(user.getEmail());

        // Only update password if it's provided and different
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        existing.setIsActive(user.getIsActive());
        existing.setIsVerified(user.getIsVerified());
        existing.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(existing);
        log.info("User updated successfully with ID: {}", updatedUser.getId());
        return updatedUser;
    }

    public void deleteUser(Long id) {
        log.info("Deleting user with ID: {}", id);
        User user = getUserById(id);
        userRepository.delete(user);
        log.info("User deleted successfully with ID: {}", id);
    }

    public void deactivateUser(Long id) {
        log.info("Deactivating user with ID: {}", id);
        User user = getUserById(id);
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("User deactivated successfully with ID: {}", id);
    }

    public void activateUser(Long id) {
        log.info("Activating user with ID: {}", id);
        User user = getUserById(id);
        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("User activated successfully with ID: {}", id);
    }

    public void verifyUser(Long id) {
        log.info("Verifying user with ID: {}", id);
        User user = getUserById(id);
        user.setIsVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("User verified successfully with ID: {}", id);
    }
}
