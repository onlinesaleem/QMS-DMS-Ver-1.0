package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {

    List<Task> findByAssignedTo(Long userId);


}
