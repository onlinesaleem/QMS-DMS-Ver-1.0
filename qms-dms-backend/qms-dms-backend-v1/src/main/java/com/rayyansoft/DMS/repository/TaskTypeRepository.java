package com.rayyansoft.DMS.repository;


import com.rayyansoft.DMS.entity.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskTypeRepository extends JpaRepository<TaskType,Long> {

    @Query(" select t from TaskType t where t.id<>1")
    List<TaskType> fetchTaskType();



}
