package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.UserSummaryDto;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.repository.UserRepository;
import com.rayyansoft.DMS.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {


    private UserRepository userRepository;
    @Override
    public Optional<User> findByUserId(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Long findUserIdByUsernameOrEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user=userRepository.findByUsername(auth.getName());

        Long userId=user.get().getId();
        return userId;
    }

    @Override
    public List<UserSummaryDto> findAllUserSummary() {
        List<UserSummaryDto> userSummaryDtoList=userRepository.findUserSummary();
        return userSummaryDtoList;
    }


}
