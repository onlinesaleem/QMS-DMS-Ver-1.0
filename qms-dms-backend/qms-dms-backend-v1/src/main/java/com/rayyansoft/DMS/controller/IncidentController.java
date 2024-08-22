package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.*;
import com.rayyansoft.DMS.service.*;
import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/incident")
@AllArgsConstructor
public class IncidentController {
    private IncidentService incidentService;
    private AuthService authService;
    private UserFeedbackService userFeedbackService;
    private EmailService emailService;
    private EmailNotificationService emailNotificationService;



    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @PostMapping("/addIncident")
    public ResponseEntity<IncidentDto> addIncidentDto(@RequestBody IncidentDto incidentDto) {
       IncidentDto saveIncidentDto=incidentService.addIncident(incidentDto);
        UserDto userDto=authService.findByEmail(incidentDto.getReportedUserId());



        if (saveIncidentDto!=null) {
            String emailAddress = emailNotificationService.findByTriggerEventName("OVR-Added");
            System.out.println("Email address added: " + emailAddress);

           // Extract email details from the saved incident record or use provided parameters
        String[] to =  new String[]{emailAddress, userDto.getEmail()};





           String subject = "New OVR Added: " + saveIncidentDto.getIncNum();
           String text = "<h1 style=\"color: #007bff;\">Incident Report</h1>"
                   + "<p>An ovr has been added with the following details:</p>"
                   + "<ul>"
                   + "<li><strong>OVR#:</strong> " + saveIncidentDto.getIncNum() + "</li>"
                   + "<li><strong>CreatedOn:</strong>" + saveIncidentDto.getCreatedOn()
                   + "<li><strong>Details:</strong> " + saveIncidentDto.getDetailsOfIncident() + "</li>"
                   + "</ul>"
                   + "<p style=\"color: #28a745;\">If further details are needed, kindly login to <a href=\"http://nbcc-ovr\">nbcc-ovr</a></p>";

           emailService.sendHtmlEmailAsync(to, subject, text);
           return new ResponseEntity<>(saveIncidentDto, HttpStatus.CREATED);
       }
       else {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
       }
    }
    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/view-incidents")
    public ResponseEntity<List<IncidentDto>> getAllIncidents()
    {
        List<IncidentDto> incidentDtos=incidentService.getAllIncidentDto();
        return ResponseEntity.ok(incidentDtos);
    }
    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/list-incidents")
    public ResponseEntity<List<Incident>> listAllIncidents()
    {
        List<Incident> incident=incidentService.getAllIncidents();
        return ResponseEntity.ok(incident);
    }
    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/view-floors")
    public ResponseEntity<List<FloorDto>> getAllFloors() {
        List<FloorDto> floorDtos=incidentService.getAllFloorDto();

        return ResponseEntity.ok(floorDtos);
    }
    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/view-locations")
    public ResponseEntity<List<LocationDto>> getAllLocations(){
        List<LocationDto> flocationDtos=incidentService.getAllLocationDto();
        return ResponseEntity.ok(flocationDtos);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/view-severity")
    public ResponseEntity<List<SeverityDto>> getAllSeverity() {
        List<SeverityDto> severityDtos=incidentService.getAllSeverityDto();
        return ResponseEntity.ok(severityDtos);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @PatchMapping("/taskAssigned/{id}")
    public ResponseEntity<IncidentDto> taskAssign(@PathVariable("id") Long incidentId) {
        IncidentDto incidentDto=incidentService.taskAssinged(incidentId);
        return ResponseEntity.ok(incidentDto);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/incidentByUser")
    public Page<Incident> fetchIncidentByUserId(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {

        Page<Incident> incidents=incidentService.fetchIncidentReportedUsers(page,size);
        return incidents;

    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/incidentById/{id}")
     public ResponseEntity<Incident> fetchIncidentById(@PathVariable("id") Long incidentId){
        Incident incident=incidentService.fetchIncidentByIncidentId(incidentId);
        return new ResponseEntity<>(incident,HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN','QUALITY')")
    @GetMapping("/kpi/inc-count/{id}")
    public Long countOfIncident(@PathVariable("id") Long statusId)
    {

        return incidentService.countOfIncident(statusId);

    }
    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/incCategory")
    public List<IncEventCategory> incEventCategoryList(){
        return incidentService.incEventCategoryList();
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @PostMapping("/addFeedback")
        public ResponseEntity<UserFeedbackDto> addUserFeedback(@RequestBody UserFeedbackDto userFeedbackDto) {
        UserFeedbackDto saveUserFeedbackDto=userFeedbackService.addUserFeedbackDto(userFeedbackDto);
        return new ResponseEntity<>(saveUserFeedbackDto, HttpStatus.CREATED);
    }


    @PreAuthorize("hasAnyRole('ADMIN','QUALITY')")
    @PostMapping("/addQualityResponse")
    public ResponseEntity<QualityResponseDto> addQualityResponse(@RequestBody QualityResponseDto qualityResponseDto) {
        QualityResponseDto saveQualityResponseDto=incidentService.addQualityResponseDto(qualityResponseDto);

        IncidentDto incidentDto=incidentService.findIncidentReportedUserId(qualityResponseDto.getIncId());
        String IncidentReportedUserEmail=authService.findByEmail(incidentDto.getReportedUserId()).getEmail();
        String QualityResponseUserEmail=authService.findByEmail(qualityResponseDto.getUpdatedUserId()).getEmail();
        if (saveQualityResponseDto != null) {

            // Extract email details from the saved incident record or use provided parameters
            String[] to = new String[]{IncidentReportedUserEmail, QualityResponseUserEmail};

            String subject = "OVR #: " + incidentDto.getIncNum() + " [Resolution Completed]";
            String text = "<h1 style=\"color: #007bff;\">OVR</h1>"
                    + "<p>The OVR report you raised has been resolved by the quality department:</p>"
                    + "<ul>"
                    + "<li><strong>OVR#:</strong> " + incidentDto.getIncNum() + "</li>"
                    + "<li><strong>Created On:</strong> " + incidentDto.getCreatedOn() + "</li>"
                    + "<li><strong>Details:</strong> " + incidentDto.getDetailsOfIncident() + "</li>"
                    + "<li><strong>Quality Response:</strong> " + qualityResponseDto.getNotes() + "</li>"
                    + "<li><strong>Quality Response Updated On:</strong> " + qualityResponseDto.getUpdatedOn() + "</li>"
                    + "</ul>"
                    + "<p style=\"color: #28a745;\">Thank you. If further details are needed, kindly log in to <a href=\"http://nbcc-ovr\">nbcc-ovr</a></p>";

            emailService.sendHtmlEmailAsync(to, subject, text);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
            // Handle the case where incident record failed to save

        }








    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/fetchQualityResponseBy/{incidentId}")
    public List<QualityResponse> fetchQualityResponse(@PathVariable ("incidentId") Long id ) {

        return incidentService.fetchQualityResponseByIncidentId(id);
    }


    @PreAuthorize("hasAnyRole('ADMIN','USER','QUALITY','MANAGER')")
    @GetMapping("/monthly-counts")
    public List<Object[]> fetchIncidentCounts(){
        return incidentService.findMonthlyIncidentCounts();
    }


}
