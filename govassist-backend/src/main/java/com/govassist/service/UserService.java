package com.govassist.service;

import com.govassist.dto.UserProfileRequest;
import com.govassist.dto.UserProfileResponse;
import com.govassist.entity.User;
import com.govassist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(String email) {
        User user = findByEmail(email);
        return mapToResponse(user);
    }

    public UserProfileResponse updateProfile(String email, UserProfileRequest request) {
        User user = findByEmail(email);

        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setState(request.getState());
        user.setDistrict(request.getDistrict());
        user.setOccupation(request.getOccupation());
        user.setEducation(request.getEducation());
        user.setAnnualIncome(request.getAnnualIncome());
        user.setCategory(request.getCategory());

        // Documents
        if (request.getHasAadhaar() != null) user.setHasAadhaar(request.getHasAadhaar());
        if (request.getHasPan() != null) user.setHasPan(request.getHasPan());
        if (request.getHasIncomeCertificate() != null) user.setHasIncomeCertificate(request.getHasIncomeCertificate());
        if (request.getHasCasteCertificate() != null) user.setHasCasteCertificate(request.getHasCasteCertificate());
        if (request.getHasDomicile() != null) user.setHasDomicile(request.getHasDomicile());
        if (request.getHasRationCard() != null) user.setHasRationCard(request.getHasRationCard());
        if (request.getHasBankPassbook() != null) user.setHasBankPassbook(request.getHasBankPassbook());

        // Mark profile as completed if all key fields are filled
        if (user.getAge() != null && user.getState() != null && user.getOccupation() != null
                && user.getAnnualIncome() != null && user.getCategory() != null) {
            user.setProfileCompleted(true);
        }

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    public UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .age(user.getAge())
                .gender(user.getGender())
                .state(user.getState())
                .district(user.getDistrict())
                .occupation(user.getOccupation())
                .education(user.getEducation())
                .annualIncome(user.getAnnualIncome())
                .category(user.getCategory())
                .hasAadhaar(user.getHasAadhaar())
                .hasPan(user.getHasPan())
                .hasIncomeCertificate(user.getHasIncomeCertificate())
                .hasCasteCertificate(user.getHasCasteCertificate())
                .hasDomicile(user.getHasDomicile())
                .hasRationCard(user.getHasRationCard())
                .hasBankPassbook(user.getHasBankPassbook())
                .profileCompleted(user.getProfileCompleted())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
