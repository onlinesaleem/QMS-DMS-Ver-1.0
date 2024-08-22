package com.rayyansoft.DMS.service.Impl;


import com.rayyansoft.DMS.dto.TemplateDto;
import com.rayyansoft.DMS.entity.Template;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.exception.ResourceNotFoundException;
import com.rayyansoft.DMS.repository.TemplateRepository;
import com.rayyansoft.DMS.repository.UserRepository;
import com.rayyansoft.DMS.service.TemplateService;
import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TemplateServiceImpl implements TemplateService {

    TemplateRepository templateRepository;
    UserRepository userRepository;


    private ModelMapper modelMapper;
    @Override
    public TemplateDto createTemplate(TemplateDto templateDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user=userRepository.findByUsername(auth.getName());
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }

        Template template = modelMapper.map(templateDto, Template.class);
        template.setCreatedDate(LocalDate.now()); // Set the created date
        template.setCreatedBy(user.get());
        Template savedTemplate = templateRepository.save(template);
        return modelMapper.map(savedTemplate, TemplateDto.class);


    }

    @Override
    public List<TemplateDto> getTemplatesByDepartmentId(Long departmentId) {
        List<Template> templates = templateRepository.findAll();
        return templates.stream()
                .map(template -> modelMapper.map(template, TemplateDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<TemplateDto> getAllTemplates() {
        List<Template> templates = templateRepository.findAll();
        return templates.stream()
                .map(template -> modelMapper.map(template, TemplateDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public TemplateDto getTemplatedById(Long templateId) {
        Template templates=templateRepository.findById(templateId)
                .orElseThrow(()->new ResourceNotFoundException("the given id not found"+templateId));;
    return  modelMapper.map(templates,TemplateDto.class);
    }


}
