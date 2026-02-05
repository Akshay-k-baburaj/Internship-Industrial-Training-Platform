package com.internship.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    @com.fasterxml.jackson.annotation.JsonProperty("access_token")
    private String accessToken;

    @com.fasterxml.jackson.annotation.JsonProperty("refresh_token")
    private String refreshToken;

    @com.fasterxml.jackson.annotation.JsonProperty("token_type")
    private String tokenType = "Bearer";

    @com.fasterxml.jackson.annotation.JsonProperty("id")
    private Long userId;

    private String email;
    private String role;

    @com.fasterxml.jackson.annotation.JsonProperty("expires_in")
    private Long expiresIn;
}
