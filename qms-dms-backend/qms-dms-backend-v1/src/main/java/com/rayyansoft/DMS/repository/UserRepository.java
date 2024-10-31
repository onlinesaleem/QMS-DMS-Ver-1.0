package com.rayyansoft.DMS.repository;


import com.rayyansoft.DMS.dto.UserSummaryDto;
import com.rayyansoft.DMS.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByEmail(String email);

  Optional<User> findByUsernameOrEmail(String username,String email);

    Boolean existsByUsername(String username);



    Page<User> findAll(Pageable pageable);

//    @Query("select new com.rayyansoft.DMS.dto.UserSummaryDto(usr.id, usr.name, usr.email, usr.empNumber, usr.department.id) " +
//            "from User usr")
//    List<UserSummaryDto> findUserSummary();

    @Query("select new com.rayyansoft.DMS.dto.UserSummaryDto(usr.id, usr.name, usr.email, usr.empNumber, dept.id) " +
            "from users usr left join usr.department dept")
    List<UserSummaryDto> findUserSummary();


}
