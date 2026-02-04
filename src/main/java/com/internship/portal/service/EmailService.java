package com.internship.portal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        if (!emailEnabled) {
            log.info("Email sending is disabled. Would have sent email to: {}", to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
        }
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (!emailEnabled) {
            log.info("Email sending is disabled. Would have sent HTML email to: {}", to);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("HTML email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to: {}", to, e);
        }
    }

    // Welcome email for new users
    public void sendWelcomeEmail(String to, String userName) {
        String subject = "Welcome to Internship Industrial Training Platform";
        String text = String.format(
                "Dear %s,\n\n" +
                        "Welcome to the Internship Industrial Training Platform!\n\n" +
                        "Your account has been created successfully. You can now log in and start exploring opportunities.\n\n"
                        +
                        "Best regards,\n" +
                        "Internship Portal Team",
                userName);
        sendSimpleEmail(to, subject, text);
    }

    // Application status update email
    public void sendApplicationStatusEmail(String to, String studentName, String opportunityTitle, String status) {
        String subject = "Application Status Update - " + opportunityTitle;
        String text = String.format(
                "Dear %s,\n\n" +
                        "Your application for '%s' has been updated.\n\n" +
                        "New Status: %s\n\n" +
                        "Please log in to your account for more details.\n\n" +
                        "Best regards,\n" +
                        "Internship Portal Team",
                studentName, opportunityTitle, status);
        sendSimpleEmail(to, subject, text);
    }

    // New opportunity notification
    public void sendNewOpportunityEmail(String to, String studentName, String opportunityTitle, String companyName) {
        String subject = "New Opportunity Available - " + opportunityTitle;
        String text = String.format(
                "Dear %s,\n\n" +
                        "A new opportunity has been posted that matches your profile!\n\n" +
                        "Position: %s\n" +
                        "Company: %s\n\n" +
                        "Log in to view details and apply.\n\n" +
                        "Best regards,\n" +
                        "Internship Portal Team",
                studentName, opportunityTitle, companyName);
        sendSimpleEmail(to, subject, text);
    }

    // Faculty approval notification
    public void sendFacultyApprovalEmail(String to, String studentName, String opportunityTitle, boolean approved) {
        String status = approved ? "APPROVED" : "REJECTED";
        String subject = "Faculty Approval - " + opportunityTitle;
        String text = String.format(
                "Dear %s,\n\n" +
                        "Your application for '%s' has been %s by the faculty.\n\n" +
                        "Please log in to your account for more details.\n\n" +
                        "Best regards,\n" +
                        "Internship Portal Team",
                studentName, opportunityTitle, status);
        sendSimpleEmail(to, subject, text);
    }

    // Password reset email
    public void sendPasswordResetEmail(String to, String resetToken) {
        String subject = "Password Reset Request";
        String text = String.format(
                "Dear User,\n\n" +
                        "You have requested to reset your password.\n\n" +
                        "Your reset token is: %s\n\n" +
                        "This token will expire in 1 hour.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "Internship Portal Team",
                resetToken);
        sendSimpleEmail(to, subject, text);
    }

    // Email verification
    public void sendVerificationEmail(String to, String verificationToken) {
        String subject = "Verify Your Email Address";
        String text = String.format(
                "Dear User,\n\n" +
                        "Please verify your email address by using the following token:\n\n" +
                        "%s\n\n" +
                        "This token will expire in 24 hours.\n\n" +
                        "Best regards,\n" +
                        "Internship Portal Team",
                verificationToken);
        sendSimpleEmail(to, subject, text);
    }
}
