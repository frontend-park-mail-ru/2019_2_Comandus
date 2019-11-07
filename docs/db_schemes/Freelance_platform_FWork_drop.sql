-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2019-10-31 18:38:46.288

-- foreign keys
ALTER TABLE contracts
    DROP CONSTRAINT contract_company;

ALTER TABLE contracts
    DROP CONSTRAINT contract_freelancer;

ALTER TABLE contracts
    DROP CONSTRAINT contract_proposal;

ALTER TABLE freelancers
    DROP CONSTRAINT freelancer_experienceLevels;

ALTER TABLE freelancers
    DROP CONSTRAINT freelancer_user_account;

ALTER TABLE has_speciality
    DROP CONSTRAINT has_category_freelancer;

ALTER TABLE has_speciality
    DROP CONSTRAINT has_category_specialities;

ALTER TABLE has_skill
    DROP CONSTRAINT has_skill_freelancer;

ALTER TABLE has_skill
    DROP CONSTRAINT has_skill_skill;

ALTER TABLE hire_managers
    DROP CONSTRAINT hire_manager_company;

ALTER TABLE hire_managers
    DROP CONSTRAINT hire_manager_user_account;

ALTER TABLE jobs
    DROP CONSTRAINT job_experienceLevels;

ALTER TABLE jobs
    DROP CONSTRAINT job_hire_manager;

ALTER TABLE jobs
    DROP CONSTRAINT job_job_types;

ALTER TABLE jobs
    DROP CONSTRAINT job_specialities;

ALTER TABLE messages
    DROP CONSTRAINT message_freelancer;

ALTER TABLE messages
    DROP CONSTRAINT message_hire_manager;

ALTER TABLE messages
    DROP CONSTRAINT message_proposal;

ALTER TABLE messages
    DROP CONSTRAINT message_proposal_status_catalog;

ALTER TABLE job_skills
    DROP CONSTRAINT other_skills_job;

ALTER TABLE job_skills
    DROP CONSTRAINT other_skills_skill;

ALTER TABLE portfolios
    DROP CONSTRAINT portfolios_freelancer;

ALTER TABLE proposals
    DROP CONSTRAINT proposal_freelancer;

ALTER TABLE proposals
    DROP CONSTRAINT proposal_job;

ALTER TABLE proposals
    DROP CONSTRAINT proposal_proposal_status_catalog;

ALTER TABLE specialities
    DROP CONSTRAINT specialities_categories;

-- tables
DROP TABLE accounts;

DROP TABLE categories;

DROP TABLE companies;

DROP TABLE contracts;

DROP TABLE experienceLevels;

DROP TABLE freelancers;

DROP TABLE has_skill;

DROP TABLE has_speciality;

DROP TABLE hire_managers;

DROP TABLE job_skills;

DROP TABLE job_types;

DROP TABLE jobs;

DROP TABLE messages;

DROP TABLE portfolios;

DROP TABLE proposal_status_catalog;

DROP TABLE proposals;

DROP TABLE skills;

DROP TABLE specialities;

-- End of file.

