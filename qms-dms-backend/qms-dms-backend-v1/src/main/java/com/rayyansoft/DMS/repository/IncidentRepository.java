package com.rayyansoft.DMS.repository;

import com.rayyansoft.DMS.entity.Incident;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident,Long> {

    @Query(value="select inc from Incident inc where inc.reportedUserId=:val")
    public Page<Incident> fetchIncidentByReportedUserId(@Param("val") Long reportedUserId, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value="UPDATE Incident  SET statusId=3 where id=:val")
    void updateIncStatus(@Param("val") Long incId);



    @Query(value="select count(*) from Incident inc where inc.statusId=:val")
    public Long countOfIncident(@Param("val") Long statusId);

    @Query(value = "SELECT MONTH(STR_TO_DATE(created_on, '%d-%m-%Y %H:%i:%s')) AS month, COUNT(*) AS count " +
            "FROM incident_mst " +
            "GROUP BY MONTH(STR_TO_DATE(created_on, '%d-%m-%Y %H:%i:%s')) " +
            "ORDER BY month", nativeQuery = true)
    List<Object[]> findMonthlyIncidentCounts();


}
