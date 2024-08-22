package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository <Todo,Long> {
}
