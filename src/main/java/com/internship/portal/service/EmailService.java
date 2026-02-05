package com.internship.portal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${app.email.from:noreply@example.com}")
    private String fromEmail;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        log.info("MOCK EMAIL SERVICE: Email sending is disabled/mocked. To: {}, Subject: {}", to, subject);
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        log.info("MOCK EMAIL SERVICE: HTML Email sending is disabled/mocked. To: {}, Subject: {}", to, subject);
    }

    // Welcome email for new users
    public void sendWelcomeEmail(String to, String userName) {
        log.info("MOCK EMAIL: Sending welcome email to {}, User: {}", to, userName);
    }

    // Application status update email
    public void sendApplicationStatusEmail(String to, String studentName, String opportunityTitle, String status) {
        log.info("MOCK EMAIL: Application status update for {}, Opportunity: {}, Status: {}", studentName,
                opportunityTitle, status);
    }

    // New opportunity notification
    public void sendNewOpportunityEmail(String to, String studentName, String opportunityTitle, String companyName) {
        log.info("MOCK EMAIL: New opportunity notification for {}, Opportunity: {}, Company: {}", studentName,
                opportunityTitle, companyName);
    }

    // Faculty approval notification
    public void sendFacultyApprovalEmail(String to, String studentName, String opportunityTitle, boolean approved) {
        log.info("MOCK EMAIL: Faculty approval email to {}. Opportunity: {}, Approved: {}", to, opportunityTitle,
                approved);
    }

    // Password reset email
    public void sendPasswordResetEmail(String to, String resetToken) {
        log.info("MOCK EMAIL: Password reset email to {}. Token: {}", to, resetToken);
    }

    // Email verification
    public void sendVerificationEmail(String to, String verificationToken) {
        log.info("MOCK EMAIL: Verification email to {}. Token: {}", to, verificationToken);
    }
}
