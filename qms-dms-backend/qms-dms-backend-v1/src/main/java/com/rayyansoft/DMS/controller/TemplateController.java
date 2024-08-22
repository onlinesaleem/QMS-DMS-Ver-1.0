package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.TemplateDto;
import com.rayyansoft.DMS.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/templates")
public class TemplateController {
    @Autowired
    private TemplateService templateService;

    @PostMapping
    public ResponseEntity<TemplateDto> createTemplate(@RequestBody TemplateDto templateDto) {

        TemplateDto createdTemplate=templateService.createTemplate(templateDto);
        return new ResponseEntity<>(createdTemplate, HttpStatus.CREATED);
    }

    @GetMapping("/department/{departmentId}")
    public List<TemplateDto> getTemplatesByDepartment(@PathVariable Long departmentId) {
        return templateService.getTemplatesByDepartmentId(departmentId);
    }

    @GetMapping
    public ResponseEntity<List<TemplateDto>> getAllTemplates() {
        List<TemplateDto> templates = templateService.getAllTemplates();
        return new ResponseEntity<>(templates, HttpStatus.OK);
    }

    @GetMapping("/template/{templateId}")
    public TemplateDto getTemplate(@PathVariable Long templateId){
        return templateService.getTemplatedById(templateId);
    }


}
