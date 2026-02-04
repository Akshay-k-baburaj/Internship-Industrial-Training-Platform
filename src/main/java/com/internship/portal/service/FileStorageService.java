package com.internship.portal.service;

import com.internship.portal.exception.FileStorageException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final Path resumeStorageLocation;
    private final Path profileStorageLocation;

    private static final List<String> ALLOWED_RESUME_EXTENSIONS = Arrays.asList("pdf", "doc", "docx");
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public FileStorageService(
            @Value("${file.upload.resume-dir}") String resumeDir,
            @Value("${file.upload.profile-dir}") String profileDir) {

        this.resumeStorageLocation = Paths.get(resumeDir).toAbsolutePath().normalize();
        this.profileStorageLocation = Paths.get(profileDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.resumeStorageLocation);
            Files.createDirectories(this.profileStorageLocation);
            log.info("File storage directories created successfully");
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.",
                    ex);
        }
    }

    public String storeResume(MultipartFile file, Long studentId) {
        return storeFile(file, resumeStorageLocation, "resume_" + studentId, ALLOWED_RESUME_EXTENSIONS);
    }

    public String storeProfileImage(MultipartFile file, Long studentId) {
        return storeFile(file, profileStorageLocation, "profile_" + studentId, ALLOWED_IMAGE_EXTENSIONS);
    }

    private String storeFile(MultipartFile file, Path storageLocation, String prefix, List<String> allowedExtensions) {
        // Validate file
        validateFile(file, allowedExtensions);

        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = FilenameUtils.getExtension(originalFileName);
        String fileName = prefix + "_" + UUID.randomUUID().toString() + "." + fileExtension;

        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = storageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("File stored successfully: {}", fileName);
            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    private void validateFile(MultipartFile file, List<String> allowedExtensions) {
        if (file.isEmpty()) {
            throw new FileStorageException("Failed to store empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("File size exceeds maximum allowed size (10MB)");
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = FilenameUtils.getExtension(originalFileName);

        if (!allowedExtensions.contains(fileExtension.toLowerCase())) {
            throw new FileStorageException(
                    "Invalid file type. Allowed types: " + String.join(", ", allowedExtensions));
        }
    }

    public Path loadResumeFile(String fileName) {
        return resumeStorageLocation.resolve(fileName).normalize();
    }

    public Path loadProfileFile(String fileName) {
        return profileStorageLocation.resolve(fileName).normalize();
    }

    public void deleteFile(Path filePath) {
        try {
            Files.deleteIfExists(filePath);
            log.info("File deleted successfully: {}", filePath.getFileName());
        } catch (IOException ex) {
            log.error("Could not delete file: {}", filePath.getFileName(), ex);
        }
    }
}
