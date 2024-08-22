package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.dto.CombinedTaskResponseDto;
import com.rayyansoft.DMS.entity.TaskResponse;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;




public interface TaskResponseRepository extends JpaRepository<TaskResponse,Long> {

    @Query(value="select tr from TaskResponse tr")
    public Page<TaskResponse> fetchAllTaskResponse(Pageable pageable);

    @Query(value="select tr from TaskResponse tr where tr.task.assignedTo=:val")
    public Page<TaskResponse> fetchTaskByUser(@Param("val") Long userId,Pageable pageable);


    @Query(value="select DISTINCT  tr from TaskResponse tr  where tr.task.taskTypeId=1 and tr.statusId=3")
    public Page<TaskResponse> fetchTaskResponseByTaskType(Pageable pageable);

   @Query(value="select trr from TaskResponse trr where trr.task.taskReferenceId=:val and trr.task.taskTypeId=1 and trr.statusId=3")
   public List<TaskResponse> incidentFinalReport(@Param("val") Long taskRefId);


   @Query(value="select tr  from TaskResponse tr where tr.task.incident.reportedUserId=:val")
   public Page<TaskResponse> taskIncidentByUser(@Param("val") Long userId,Pageable pageable);


   @Modifying
   @Transactional
   @Query(value="update TaskResponse tr SET tr.userFeedBackId=:userFeedBackId,tr.isUserFeedBackDone=:isUserFeedBackDone where tr.id=:id")
   public void updateTaskUserFeedback(@Param("id") Long id, @Param("userFeedBackId") Long userFeedBackId, @Param("isUserFeedBackDone")
                                Boolean IsUserFeedBackDone );

    Optional<TaskResponse> findByTaskId(Long taskId);

    @Query(value = "SELECT new com.rayyansoft.DMS.dto.CombinedTaskResponseDto(" +
            "new com.rayyansoft.DMS.dto.TaskDto(tm.id, tm.assignedTo, tm.createdBy, tm.createdOn, tm.taskTypeId, tm.taskReferenceId, tm.taskNote, tm.taskNumber, tm.dueDate), " +
            "new com.rayyansoft.DMS.dto.TaskResponseDto(tr.statusId, tr.responseText, tr.respondedBy, tr.updatedOn, tr.isUserFeedBackDone, tr.userFeedBackId)) " +
            "FROM Task tm " +
            "JOIN TaskResponse tr ON tr.task.id = tm.id " +
            "WHERE tm.taskReferenceId = :taskReferenceId AND tm.taskTypeId = :taskTypeId")
    List<CombinedTaskResponseDto> findCombinedTaskResponseByTaskReferenceIdAndTaskTypeId(@Param("taskReferenceId") Long taskReferenceId, @Param("taskTypeId") Long taskTypeId);

    @Query(value="select DISTINCT  tr from TaskResponse tr  where tr.task.taskTypeId<>1")
    public Page<TaskResponse> fetchGeneralTaskList(Pageable pageable);
}



