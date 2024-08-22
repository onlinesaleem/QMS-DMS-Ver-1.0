package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.TemplateDto;

import java.util.List;

public interface TemplateService {

    public TemplateDto createTemplate(TemplateDto templateDto);

    public List<TemplateDto> getTemplatesByDepartmentId(Long departmentId);

    public List<TemplateDto> getAllTemplates();

    public TemplateDto getTemplatedById(Long templateId);
}
