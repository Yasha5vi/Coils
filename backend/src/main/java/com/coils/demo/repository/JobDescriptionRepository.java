package com.coils.demo.repository;

import com.coils.demo.entity.JobDescription;
import com.coils.demo.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {
    List<JobDescription> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);
    List<JobDescription> findByStatus(JobStatus status);
}
