package com.rayyansoft.DMS.controller;


import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.Status;
import com.rayyansoft.DMS.entity.TaskResponse;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.service.AuthService;
import com.rayyansoft.DMS.service.EmailService;
import com.rayyansoft.DMS.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/task")
@AllArgsConstructor
public class TaskController {
    private TaskService taskService;
    private AuthService authService;
    private EmailService emailService;


    @PreAuthorize("hasAnyRole('ADMIN','QUALITY','MANAGER','USER')")
    @PostMapping
    public ResponseEntity<TaskDto> addTask(@RequestBody TaskDto taskDto) {
        TaskDto savedTaskDto = taskService.addTaskDto(taskDto);
        UserDto userDto=authService.findByEmail(taskDto.getAssignedTo());


        if (savedTaskDto!=null) {

            // Extract email details from the saved incident record or use provided parameters

            String[] to = new String[]{userDto.getEmail()};;
            String subject = "New task added: " + savedTaskDto.getTaskNumber();
            String text = "<h1 style=\"color: #007bff;\">Task details</h1>"
                    + "<p>An new task has been added to you with the following details:</p>"
                    + "<ul>"
                    + "<li><strong>Task#:</strong> " + savedTaskDto.getTaskNumber() + "</li>"
                    + "<li><strong>Due Date:</strong>" + taskDto.getDueDate()
                    + "<li><strong>Details:</strong> " + taskDto.getTaskNote() + "</li>"
                    + "</ul>"
                    + "<p style=\"color: #28a745;\">If further details are needed, kindly login to <a href=\"http://nbcc-ovr\">nbcc-ovr</a></p>";

            emailService.sendHtmlEmailAsync(to, subject, text);
            return new ResponseEntity<>(savedTaskDto, HttpStatus.CREATED);
        }
        else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }


    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/task-list")
    public ResponseEntity<List<TaskDto>> getAllTask() {
        List<TaskDto> taskDto = taskService.getAllTasks();
        return ResponseEntity.ok(taskDto);

    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/user-list")
    public ResponseEntity<List<User>> getAllUser() {
        List<User> user = taskService.getAllUser();
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/taskByUser")
    public ResponseEntity<List<TaskDto>> getAllTaskByUser() {

        List<TaskDto> taskDtos = taskService.getTaskByUser();
        return ResponseEntity.ok(taskDtos);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/fetchAllTasks")
    public Page<TaskResponse> fetchAllTask(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        return taskService.fetchAllTaskResponse(page, size);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/fetchTaskByUser")
    public Page<TaskResponse> fetchTaskByUser(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {

        return taskService.fetchTaskByUser(page, size);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/status")
    public List<Status> fetchStatus() {
        List<Status> status = taskService.fetchStatusAll();
        return status;
    }

    //@PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @PutMapping("/updateResponse/{Tid}")
    public ResponseEntity<TaskResponseDto> updateTaskResponse(
            @RequestBody TaskResponseDto taskResponseDto,
            @PathVariable("Tid") Long taskId) {
    System.out.println("this function calling.."+taskResponseDto.getStatusId());
                    TaskResponseDto savedTaskResponseDto = taskService.updateTaskResponseDto(taskResponseDto, taskId);
            return ResponseEntity.ok(savedTaskResponseDto);

    }
    @PutMapping("/testDisplay/{testId}")
    public String testDisplay(@PathVariable("testId") Long testId)
    {
        return "this is for testing api http://localhost:8080/api/task/testDisplay and test id is"+testId;
    }
    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/taskResponse")
    public Page<TaskResponse> taskResponses(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {

        return taskService.fetchTaskResponseByTaskType(page, size);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/incidentReport/{taskRefId}")
    public List<TaskResponse> taskResponses(@PathVariable("taskRefId") Long taskReferenceId) {
        return taskService.incidentFinalRep(taskReferenceId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/taskIncidentByUser")

    public Page<TaskResponse> taskIncidentResponses(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {

        return taskService.taskIncidentByUser(page,size);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @PutMapping("/responseUserFeedBackUpdate/{id}")
    public void updateTaskResponseUserFeedBack(@PathVariable("id") Long id,

                                                                          @RequestBody TaskResponseDto taskResponseDto){
taskService.updateTaskResponseFeedback(id,taskResponseDto);







    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/responses")
    public ResponseEntity<List<CombinedTaskResponseDto>> getTaskResponses(@RequestParam Long taskReferenceId, @RequestParam Long taskTypeId) {
        List<CombinedTaskResponseDto> taskResponses = taskService.findCombinedTaskResponseByTaskReferenceIdAndTaskTypeId(taskReferenceId,taskTypeId);
        return ResponseEntity.ok(taskResponses);
    }
    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/taskTypes")
    public ResponseEntity<List<TaskTypeDto>> getTaskType() {
        List<TaskTypeDto> taskTypeDtos=taskService.fetchTaskTypeByGeneral();
        return  ResponseEntity.ok(taskTypeDtos);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/general-task-list")
    public Page<TaskResponse> GeneralTaskResponse(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {

        return taskService.fetchGeneralTaskList(page, size);
    }


}


