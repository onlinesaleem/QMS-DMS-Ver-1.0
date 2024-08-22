package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.QualityResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QualityResponseRepository extends JpaRepository<QualityResponse,Long> {

    List<QualityResponse> findByIncId(Long incId);

}
