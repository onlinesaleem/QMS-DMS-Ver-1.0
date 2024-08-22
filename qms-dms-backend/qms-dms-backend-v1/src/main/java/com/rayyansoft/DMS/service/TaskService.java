package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TaskService {

    TaskDto addTaskDto(TaskDto taskDto);
    List<TaskDto> getAllTasks();

    List<User> getAllUser();

    List<TaskDto> getTaskByUser();

    Page<TaskResponse> fetchAllTaskResponse(int page,int size);

    Page<TaskResponse>  fetchTaskByUser(int page, int size);

    List<Status> fetchStatusAll();

    TaskResponseDto updateTaskResponseDto(TaskResponseDto taskResponseDto, Long taskId);

  Page<TaskResponse> fetchTaskResponseByTaskType(int page, int size);

 List<TaskResponse> incidentFinalRep(Long taskReferenceId);



Page<TaskResponse> taskIncidentByUser(int page,int size);

    TaskResponseDto updateTaskResponseUserFeedBack(Long id, TaskResponseDto taskResponseDto);

   void updateTaskResponseFeedback(Long id, TaskResponseDto taskResponseDto);

    List<CombinedTaskResponseDto> findCombinedTaskResponseByTaskReferenceIdAndTaskTypeId(Long taskReferenceId, Long taskTypeId);

    List<TaskTypeDto> fetchTaskTypeByGeneral();

    Page<TaskResponse> fetchGeneralTaskList(int page, int size);
}
