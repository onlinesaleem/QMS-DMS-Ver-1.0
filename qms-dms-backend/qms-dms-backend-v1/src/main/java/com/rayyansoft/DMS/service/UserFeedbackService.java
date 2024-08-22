package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.TaskResponseDto;
import com.rayyansoft.DMS.dto.UserFeedbackDto;

public interface UserFeedbackService {
    UserFeedbackDto addUserFeedbackDto(UserFeedbackDto userFeedbackDto);

    void updateTaskResponseFeedback(Long id, TaskResponseDto taskResponseDto);
}
