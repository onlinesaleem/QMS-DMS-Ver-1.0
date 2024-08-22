package com.rayyansoft.DMS.repository;


import com.rayyansoft.DMS.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByEmail(String email);

  Optional<User> findByUsernameOrEmail(String username,String email);

    Boolean existsByUsername(String username);



    Page<User> findAll(Pageable pageable);


}
