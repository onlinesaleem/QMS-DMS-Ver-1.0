package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.entity.Module;
import com.rayyansoft.DMS.repository.ModuleRepository;
import com.rayyansoft.DMS.service.ModuleService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Getter
@Setter
@AllArgsConstructor
@Service
public class ModuleServiceImpl implements ModuleService {

    private ModuleRepository moduleRepository;
    @Override
    public Optional<Module> findById(Long moduleId) {
        return moduleRepository.findById(moduleId);
    }
}
