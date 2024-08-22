package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document,Long> {

    List<Document> findByDocumentDepartment_Id(Long departmentId);


}
