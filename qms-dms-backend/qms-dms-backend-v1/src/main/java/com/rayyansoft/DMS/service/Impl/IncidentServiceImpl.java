package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.*;
import com.rayyansoft.DMS.exception.ResourceNotFoundException;
import com.rayyansoft.DMS.repository.*;
import com.rayyansoft.DMS.service.IncidentService;
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
public class IncidentServiceImpl implements IncidentService {

    private IncidentRepository incidentRepository;

    private FloorRepository floorRepository;

    private LocationRepository locationRepository;

    private SeverityRepository severityRepository;

    private StatusRepository statusRepository;

    private UserRepository userRepository;

    private IncEventCategoryRepository incEventCategoryRepository;

    private QualityResponseRepository qualityResponseRepository;

    private ModelMapper modelMapper;

    @Override
    public IncidentDto addIncident(IncidentDto incidentDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Date date = new Date();
        SimpleDateFormat  formatter = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
        String strDate = formatter.format(date);
        strDate = formatter.format(date);
        Long incnum=incidentRepository.count()+1;
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Long userId=user.get().getId();
        System.out.println("the logged user id is"+userId);
        incidentDto.setIncNum("INC-"+incnum);
        incidentDto.setReportedOn(strDate);
        incidentDto.setCreatedOn(strDate);
        incidentDto.setReportedUserId(userId);
        incidentDto.setReportedBy(auth.getName());
        incidentDto.setReportedUserId(userId);
        Incident inc=new Incident();

        Incident incident=modelMapper.map(incidentDto,Incident.class);
        incident.setStatusId(1L);
        Incident savedIncident=incidentRepository.save(incident);
        IncidentDto savedIncidentDto=modelMapper.map(savedIncident,IncidentDto.class);

        return savedIncidentDto;    }

    @Override
    public List<IncidentDto> getAllIncidentDto() {
        List<Incident> incidents=incidentRepository.findAll();

        return incidents.stream().map((incident)->modelMapper.map(incident, IncidentDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<FloorDto> getAllFloorDto() {
        List<Floor> floors=floorRepository.findAll();
        return floors.stream().map((floor -> modelMapper.map(floor,FloorDto.class)))
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationDto> getAllLocationDto() {
        List<Location> locations=locationRepository.findAll();

        return locations.stream().map((location -> modelMapper.map(location,LocationDto.class)))
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> getAllIncidents() {
        List<Incident> incidents=incidentRepository.findAll();
        return incidents;
    }

    @Override
    public List<SeverityDto> getAllSeverityDto() {
        List<Severity> severities=severityRepository.findAll();
        return severities.stream().map((severity -> modelMapper.map(severity,SeverityDto.class)))
                .collect(Collectors.toList());
    }

    @Override
    public List<StatusDto> getAllStatusDto() {
        List<Status> statuses=statusRepository.findAll();
        return statuses.stream().map((status -> modelMapper.map(status,StatusDto.class)))
                .collect(Collectors.toList());
    }

    @Override
    public Long getUsernameRecords(String username) {
        Optional<User> user=userRepository.findByUsername(username);
        Long userid=user.get().getId();
        return userid;
    }

    @Override
    public IncidentDto taskAssinged(Long incidentId) {
        Incident incident=incidentRepository.findById(incidentId)
                .orElseThrow(()->new ResourceNotFoundException("the given id not found"+incidentId));
        incident.settAssigned(Boolean.TRUE);
        Incident updatedincident=incidentRepository.save(incident);
        return modelMapper.map(updatedincident,IncidentDto.class);
    }

    @Override
    public Page<Incident> fetchIncidentReportedUsers(int page,int size) {
        Pageable pageable= PageRequest.of(page, size);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Long userId=user.get().getId();
       Page<Incident> incident=incidentRepository.fetchIncidentByReportedUserId(userId,pageable);

        return incident;
    }

    @Override
    public Incident fetchIncidentByIncidentId(Long incidentId) {
        Incident incident=incidentRepository.findById(incidentId).orElseThrow(
                () -> new ResourceNotFoundException("Todo not found with id: "+  incidentId));
        return incident;
    }

    @Override
    public Long countOfIncident(Long statusId) {

        return incidentRepository.countOfIncident(statusId);
    }

    @Override
    public List<IncEventCategory> incEventCategoryList() {
        return incEventCategoryRepository.findAll();
    }

    @Override
    public QualityResponseDto addQualityResponseDto(QualityResponseDto qualityResponseDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Date date = new Date();
        SimpleDateFormat  formatter = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
        String strDate = formatter.format(date);
        strDate = formatter.format(date);

        Optional<User> user=userRepository.findByUsername(auth.getName());
        Long userId=user.get().getId();
        qualityResponseDto.setUpdatedUserId(userId);
        qualityResponseDto.setUpdatedOn(strDate);

        QualityResponse qualityResponse=modelMapper.map(qualityResponseDto,QualityResponse.class);

        QualityResponse savedQualityResponse=qualityResponseRepository.save(qualityResponse);
        updateIncStatus(qualityResponseDto.getIncId());
        return modelMapper.map(savedQualityResponse,QualityResponseDto.class);
    }

    @Override
    public void updateIncStatus(Long incId) {
        incidentRepository.updateIncStatus(incId);
    }

    @Override
    public List<QualityResponse> fetchQualityResponseByIncidentId(Long incidentId) {

        return qualityResponseRepository.findByIncId(incidentId);
    }

    @Override
    public IncidentDto findIncidentReportedUserId(Long reportedUserId) {
        Incident incident=incidentRepository.findById(reportedUserId).orElseThrow(
                ()->new ResourceNotFoundException("the given id is not found"+reportedUserId)
        );
        return modelMapper.map(incident,IncidentDto.class);
    }

    @Override
    public List<Object[]> findMonthlyIncidentCounts() {
        return incidentRepository.findMonthlyIncidentCounts();
    }


}

