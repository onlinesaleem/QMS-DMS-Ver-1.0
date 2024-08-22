package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TemplateRepository extends JpaRepository<Template,Long> {

    List<Template> findByDepartmentId(Long departmentId);
}
