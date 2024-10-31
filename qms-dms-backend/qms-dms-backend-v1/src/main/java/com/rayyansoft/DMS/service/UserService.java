package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.UserSummaryDto;
import com.rayyansoft.DMS.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

  Optional<User>  findByUserId(Long id);

  Long findUserIdByUsernameOrEmail();

  List<UserSummaryDto> findAllUserSummary();
}
