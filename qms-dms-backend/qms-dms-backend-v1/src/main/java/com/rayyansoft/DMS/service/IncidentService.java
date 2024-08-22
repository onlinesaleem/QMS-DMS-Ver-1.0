package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.IncEventCategory;
import com.rayyansoft.DMS.entity.Incident;
import com.rayyansoft.DMS.entity.QualityResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IncidentService {

    IncidentDto addIncident(IncidentDto incidentDto);

    List<IncidentDto> getAllIncidentDto();

    List<FloorDto> getAllFloorDto();

    List<LocationDto> getAllLocationDto();

    List<Incident> getAllIncidents();

    List<SeverityDto> getAllSeverityDto();

    List<StatusDto> getAllStatusDto();

  Long getUsernameRecords(String username);

    IncidentDto taskAssinged(Long incidentId);

    Page<Incident> fetchIncidentReportedUsers(int page,int size);

   Incident fetchIncidentByIncidentId(Long incidentId);

   public Long countOfIncident(Long statusId);

   List<IncEventCategory> incEventCategoryList();

   QualityResponseDto addQualityResponseDto(QualityResponseDto qualityResponseDto);

    void updateIncStatus(Long incId);

    List<QualityResponse> fetchQualityResponseByIncidentId(Long incidentId);

    IncidentDto findIncidentReportedUserId(Long reportedUserId);

    List<Object[]> findMonthlyIncidentCounts();
}
