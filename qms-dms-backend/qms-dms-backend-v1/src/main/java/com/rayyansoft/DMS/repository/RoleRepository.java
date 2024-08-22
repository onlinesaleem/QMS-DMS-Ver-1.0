package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Long> {

    Role findByName(String name) ;

}
