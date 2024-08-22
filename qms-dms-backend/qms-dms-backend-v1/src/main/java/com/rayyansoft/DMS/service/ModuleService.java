package com.rayyansoft.DMS.service;


import com.rayyansoft.DMS.entity.Module;

import java.util.Optional;

public interface ModuleService {


    Optional<Module> findById(Long moduleId);
}
