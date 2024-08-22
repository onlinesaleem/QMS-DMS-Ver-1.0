package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.CombinedTaskResponseDto;
import com.rayyansoft.DMS.dto.TaskDto;
import com.rayyansoft.DMS.dto.TaskResponseDto;
import com.rayyansoft.DMS.dto.TaskTypeDto;
import com.rayyansoft.DMS.entity.*;
import com.rayyansoft.DMS.exception.ResourceNotFoundException;
import com.rayyansoft.DMS.repository.*;
import com.rayyansoft.DMS.service.TaskService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TaskServiceImpl implements TaskService {

    private TaskRepository taskRepository;

    private StatusRepository statusRepository;

    private IncidentRepository incidentRepository;

    private TaskResponseRepository taskResponseRepository;
    private UserRepository userRepository;
    private TaskTypeRepository taskTypeRepository;
    private ModelMapper modelMapper;


    @Override
    public TaskDto addTaskDto(TaskDto taskDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
        String strDate = formatter.format(date);
        strDate = formatter.format(date);
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Long userId=user.get().getId();


        taskDto.setCreatedOn(strDate);
        taskDto.setCreatedBy(userId);

        long taskNum=taskRepository.count()+1;
        taskDto.setTaskNumber("TK-"+taskNum);
        Task task=modelMapper.map(taskDto,Task.class);
        TaskResponse taskResponse=new TaskResponse();
        taskResponse.setCreatedOn(strDate);
        taskResponse.setStatusId(1L);
        taskResponse.setTask(task);

        TaskResponse savedTaskResponse=taskResponseRepository.save(taskResponse);
        //Task savedTask=taskRepository.save(task);


        return modelMapper.map(savedTaskResponse, TaskDto.class);
    }

    @Override
    public List<TaskDto> getAllTasks() {

        List<Task> tasks=taskRepository.findAll();
        return tasks.stream().map((task -> modelMapper.map(task, TaskDto.class)))
                .collect(Collectors.toList());
    }

    @Override
    public List<User> getAllUser() {

        List<User> user=userRepository.findAll();
        return  user;

    }

    @Override
    public List<TaskDto> getTaskByUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Long userId=user.get().getId();
        List<Task> tasks=taskRepository.findByAssignedTo(userId);

        return tasks.stream().map((task -> modelMapper.map(task,TaskDto.class)))
                .collect(Collectors.toList());
    }

    @Override
    public Page<TaskResponse> fetchAllTaskResponse(int page,int size) {
       Pageable pageable= PageRequest.of(page, size);
        Page<TaskResponse> taskResponses=taskResponseRepository.fetchAllTaskResponse(pageable);
        return taskResponses;
    }

    @Override
    public Page<TaskResponse> fetchTaskByUser(int page,int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Pageable pageable= PageRequest.of(page, size);
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Long userId=user.get().getId();
        Page<TaskResponse> taskResponses=taskResponseRepository.fetchTaskByUser(userId,pageable);
        return taskResponses;
    }

    @Override
    public List<Status> fetchStatusAll() {
        List<Status> status=statusRepository.findAll();

        return status;
    }

    @Override
    public  TaskResponseDto updateTaskResponseDto(TaskResponseDto taskResponseDto, Long taskId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
        String strDate = formatter.format(date);

        Optional<User> userOpt = userRepository.findByUsername(auth.getName());
        if (!userOpt.isPresent()) {
            throw new ResourceNotFoundException("User not found: " + auth.getName());
        }

        User user = userOpt.get();
        Long userId = user.getId();

        TaskResponse taskResponse = taskResponseRepository.findByTaskId(taskId).orElseThrow(
                () -> new ResourceNotFoundException("The given taskId not found: " + taskId)
        );

        if(taskResponseDto.getStatusId()==3) {
            taskResponse.setResponseText(taskResponseDto.getResponseText());
        }
        if(taskResponseDto.getStatusId()==2) {
            taskResponse.setInProgressNotes(taskResponseDto.getResponseText());
        }
        taskResponse.setStatusId(taskResponseDto.getStatusId());
        taskResponse.setUpdatedOn(strDate);
        taskResponse.setRespondedBy(userId);

        TaskResponse savedTaskResponse = taskResponseRepository.save(taskResponse);
        return modelMapper.map(savedTaskResponse, TaskResponseDto.class);
       
    }

    @Override
    public Page<TaskResponse> fetchTaskResponseByTaskType(int page,int size) {
        Pageable pageable= PageRequest.of(page, size);
        return taskResponseRepository.fetchTaskResponseByTaskType(pageable);
    }

    @Override
    public List<TaskResponse> incidentFinalRep(Long taskReferenceId) {

        List<TaskResponse> taskResponse=taskResponseRepository.incidentFinalReport(taskReferenceId);


        return taskResponse;
    }



    @Override
    public Page<TaskResponse> taskIncidentByUser( int page, int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Long loginId=user.get().getId();
        Pageable pageable= PageRequest.of(page, size);
        return taskResponseRepository.taskIncidentByUser(loginId,pageable);
    }


    public TaskResponseDto updateTaskResponseUserFeedBack(Long id, TaskResponseDto taskResponseDto) {
        TaskResponse taskResponse=taskResponseRepository.findById(id).orElseThrow(
                ()->new ResourceNotFoundException("the given Id not found"+id)
        );
        taskResponse.setUserFeedBackId(taskResponseDto.getUserFeedBackId());
        taskResponse.setUserFeedBackDone(taskResponseDto.getIsUserFeedBackDone());
        TaskResponse saveTaskFeedBackUpdate=taskResponseRepository.save(taskResponse);
        return  modelMapper.map(saveTaskFeedBackUpdate,TaskResponseDto.class);
    }

    @Override
    public void updateTaskResponseFeedback(Long id, TaskResponseDto taskResponseDto) {
    taskResponseRepository.updateTaskUserFeedback(id,taskResponseDto.getUserFeedBackId(),
                taskResponseDto.getIsUserFeedBackDone());

    }

    @Override
    public List<CombinedTaskResponseDto> findCombinedTaskResponseByTaskReferenceIdAndTaskTypeId(Long taskReferenceId, Long taskTypeId) {
        return taskResponseRepository.findCombinedTaskResponseByTaskReferenceIdAndTaskTypeId(taskReferenceId, taskTypeId);
    }

    @Override
    public List<TaskTypeDto> fetchTaskTypeByGeneral() {
        List<TaskType> taskTypes = taskTypeRepository.fetchTaskType();

        // Mapping List<TaskType> to List<TaskTypeDto>
        return taskTypes.stream()
                .map(taskType -> modelMapper.map(taskType, TaskTypeDto.class))
                .collect(Collectors.toList());

    }

    @Override
    public Page<TaskResponse> fetchGeneralTaskList(int page, int size) {

        Pageable pageable= PageRequest.of(page, size);
        return taskResponseRepository.fetchGeneralTaskList(pageable);
    }


}
