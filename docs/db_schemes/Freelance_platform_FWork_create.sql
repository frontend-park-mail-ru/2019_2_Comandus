-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2019-10-31 18:38:46.288

-- tables
-- Table: accounts
CREATE TABLE accounts (
    id bigserial  NOT NULL,
    userName varchar(128)  NOT NULL,
    password varchar(32)  NOT NULL,
    email varchar(128)  NOT NULL,
    firstName varchar(128)  NULL,
    lastName varchar(128)  NULL,
    avatar bytea  NULL,
    currentRole int  NOT NULL,
    CONSTRAINT user_accounts_ak_1 UNIQUE (userName, email) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT accounts_pk PRIMARY KEY (id)
);

-- Table: categories
CREATE TABLE categories (
    id serial  NOT NULL,
    name varchar(128)  NOT NULL,
    CONSTRAINT categories_ak_1 UNIQUE (name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT categories_pk PRIMARY KEY (id)
);

-- Table: companies
CREATE TABLE companies (
    id bigserial  NOT NULL,
    name varchar(128)  NOT NULL,
    site varchar(128)  NULL,
    tagline varchar(128)  NULL,
    description text  NULL,
    city varchar(128)  NULL,
    phone varchar(64)  NULL,
    avatar bytea  NULL,
    CONSTRAINT companies_pk PRIMARY KEY (id)
);

-- Table: contracts
CREATE TABLE contracts (
    id serial  NOT NULL,
    proposal_id bigint  NOT NULL,
    company_id bigint  NOT NULL,
    freelancer_id bigint  NOT NULL,
    start_time timestamp  NOT NULL,
    end_time timestamp  NULL,
    payment_amount decimal(8,2)  NOT NULL,
    CONSTRAINT contracts_pk PRIMARY KEY (id)
);

-- Table: experienceLevels
CREATE TABLE experienceLevels (
    id serial  NOT NULL,
    name varchar(128)  NOT NULL,
    CONSTRAINT experienceLevels_ak_1 UNIQUE (name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT experienceLevels_pk PRIMARY KEY (id)
);

-- Table: freelancers
CREATE TABLE freelancers (
    id bigserial  NOT NULL,
    accountId bigint  NOT NULL,
    registrationDate timestamp  NOT NULL,
    experienceLevelId int  NOT NULL,
    city varchar(255)  NULL,
    tagline varchar(255)  NULL,
    description text  NULL,
    phone varchar(64)  NULL,
    CONSTRAINT freelancer_ak_1 UNIQUE (accountId) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT freelancers_pk PRIMARY KEY (id)
);

-- Table: has_skill
CREATE TABLE has_skill (
    id serial  NOT NULL,
    freelancer_id bigint  NOT NULL,
    skill_id int  NOT NULL,
    CONSTRAINT has_skill_ak_1 UNIQUE (freelancer_id, skill_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT has_skill_pk PRIMARY KEY (id)
);

-- Table: has_speciality
CREATE TABLE has_speciality (
    id serial  NOT NULL,
    freelancer_id bigint  NOT NULL,
    speciality_id int  NOT NULL,
    CONSTRAINT has_category_ak_1 UNIQUE (freelancer_id, speciality_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT has_speciality_pk PRIMARY KEY (id)
);

-- Table: hire_managers
CREATE TABLE hire_managers (
    id bigserial  NOT NULL,
    accountId bigint  NOT NULL,
    registrationDate timestamp  NOT NULL,
    companyId bigint  NULL,
    CONSTRAINT hire_manager_ak_1 UNIQUE (accountId) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT hire_managers_pk PRIMARY KEY (id)
);

-- Table: job_skills
CREATE TABLE job_skills (
    id serial  NOT NULL,
    job_id bigint  NOT NULL,
    skill_id int  NOT NULL,
    CONSTRAINT job_skills_ak_1 UNIQUE (job_id, skill_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT job_skills_pk PRIMARY KEY (id)
);

-- Table: job_types
CREATE TABLE job_types (
    id serial  NOT NULL,
    name varchar(128)  NOT NULL,
    CONSTRAINT job_types_ak_1 UNIQUE (name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT job_types_pk PRIMARY KEY (id)
);

-- Table: jobs
CREATE TABLE jobs (
    id bigserial  NOT NULL,
    hire_manager_id bigint  NOT NULL,
    title varchar(255)  NOT NULL,
    description text  NOT NULL,
    city varchar(255)  NULL,
    payment_amount decimal(8,2)  NOT NULL,
    experience_level_id int  NOT NULL,
    speciality_id int  NOT NULL,
    job_type_id int  NOT NULL,
    CONSTRAINT jobs_pk PRIMARY KEY (id)
);

-- Table: messages
CREATE TABLE messages (
    id bigserial  NOT NULL,
    freelancer_id bigint  NULL,
    hire_manager_id bigint  NULL,
    message_time timestamp  NOT NULL,
    message_text text  NOT NULL,
    proposal_id bigint  NOT NULL,
    proposal_status_catalog_id int  NULL,
    CONSTRAINT messages_pk PRIMARY KEY (id)
);

-- Table: portfolios
CREATE TABLE portfolios (
    id bigserial  NOT NULL,
    freelancer_id bigint  NOT NULL,
    project_title varchar(255)  NOT NULL,
    completion_date date  NOT NULL,
    project_file bytea  NULL,
    project_description text  NULL,
    project_url varchar(255)  NULL,
    CONSTRAINT portfolios_ak_1 UNIQUE (freelancer_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT portfolios_pk PRIMARY KEY (id)
);

-- Table: proposal_status_catalog
CREATE TABLE proposal_status_catalog (
    id serial  NOT NULL,
    status_name varchar(128)  NOT NULL,
    CONSTRAINT proposal_status_catalog_ak_1 UNIQUE (status_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT proposal_status_catalog_pk PRIMARY KEY (id)
);

-- Table: proposals
CREATE TABLE proposals (
    id bigserial  NOT NULL,
    job_id bigint  NOT NULL,
    freelancer_id bigint  NOT NULL,
    proposal_time timestamp  NOT NULL,
    payment_amount decimal(8,2)  NOT NULL,
    current_proposal_status int  NOT NULL,
    client_grade int  NULL,
    client_comment text  NULL,
    freelancer_grade int  NULL,
    freelancer_comment text  NULL,
    CONSTRAINT proposals_pk PRIMARY KEY (id)
);

-- Table: skills
CREATE TABLE skills (
    id serial  NOT NULL,
    skill_name varchar(128)  NOT NULL,
    CONSTRAINT skill_ak_1 UNIQUE (skill_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT skills_pk PRIMARY KEY (id)
);

-- Table: specialities
CREATE TABLE specialities (
    id serial  NOT NULL,
    category_id int  NOT NULL,
    name varchar(128)  NOT NULL,
    CONSTRAINT specialities_ak_1 UNIQUE (name, category_id) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT specialities_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: contract_company (table: contracts)
ALTER TABLE contracts ADD CONSTRAINT contract_company
    FOREIGN KEY (company_id)
    REFERENCES companies (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: contract_freelancer (table: contracts)
ALTER TABLE contracts ADD CONSTRAINT contract_freelancer
    FOREIGN KEY (freelancer_id)
    REFERENCES freelancers (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: contract_proposal (table: contracts)
ALTER TABLE contracts ADD CONSTRAINT contract_proposal
    FOREIGN KEY (proposal_id)
    REFERENCES proposals (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: freelancer_experienceLevels (table: freelancers)
ALTER TABLE freelancers ADD CONSTRAINT freelancer_experienceLevels
    FOREIGN KEY (experienceLevelId)
    REFERENCES experienceLevels (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: freelancer_user_account (table: freelancers)
ALTER TABLE freelancers ADD CONSTRAINT freelancer_user_account
    FOREIGN KEY (accountId)
    REFERENCES accounts (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: has_category_freelancer (table: has_speciality)
ALTER TABLE has_speciality ADD CONSTRAINT has_category_freelancer
    FOREIGN KEY (freelancer_id)
    REFERENCES freelancers (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: has_category_specialities (table: has_speciality)
ALTER TABLE has_speciality ADD CONSTRAINT has_category_specialities
    FOREIGN KEY (speciality_id)
    REFERENCES specialities (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: has_skill_freelancer (table: has_skill)
ALTER TABLE has_skill ADD CONSTRAINT has_skill_freelancer
    FOREIGN KEY (freelancer_id)
    REFERENCES freelancers (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: has_skill_skill (table: has_skill)
ALTER TABLE has_skill ADD CONSTRAINT has_skill_skill
    FOREIGN KEY (skill_id)
    REFERENCES skills (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: hire_manager_company (table: hire_managers)
ALTER TABLE hire_managers ADD CONSTRAINT hire_manager_company
    FOREIGN KEY (companyId)
    REFERENCES companies (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: hire_manager_user_account (table: hire_managers)
ALTER TABLE hire_managers ADD CONSTRAINT hire_manager_user_account
    FOREIGN KEY (accountId)
    REFERENCES accounts (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: job_experienceLevels (table: jobs)
ALTER TABLE jobs ADD CONSTRAINT job_experienceLevels
    FOREIGN KEY (experience_level_id)
    REFERENCES experienceLevels (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: job_hire_manager (table: jobs)
ALTER TABLE jobs ADD CONSTRAINT job_hire_manager
    FOREIGN KEY (hire_manager_id)
    REFERENCES hire_managers (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: job_job_types (table: jobs)
ALTER TABLE jobs ADD CONSTRAINT job_job_types
    FOREIGN KEY (job_type_id)
    REFERENCES job_types (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: job_specialities (table: jobs)
ALTER TABLE jobs ADD CONSTRAINT job_specialities
    FOREIGN KEY (speciality_id)
    REFERENCES specialities (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: message_freelancer (table: messages)
ALTER TABLE messages ADD CONSTRAINT message_freelancer
    FOREIGN KEY (freelancer_id)
    REFERENCES freelancers (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: message_hire_manager (table: messages)
ALTER TABLE messages ADD CONSTRAINT message_hire_manager
    FOREIGN KEY (hire_manager_id)
    REFERENCES hire_managers (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: message_proposal (table: messages)
ALTER TABLE messages ADD CONSTRAINT message_proposal
    FOREIGN KEY (proposal_id)
    REFERENCES proposals (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: message_proposal_status_catalog (table: messages)
ALTER TABLE messages ADD CONSTRAINT message_proposal_status_catalog
    FOREIGN KEY (proposal_status_catalog_id)
    REFERENCES proposal_status_catalog (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: other_skills_job (table: job_skills)
ALTER TABLE job_skills ADD CONSTRAINT other_skills_job
    FOREIGN KEY (job_id)
    REFERENCES jobs (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: other_skills_skill (table: job_skills)
ALTER TABLE job_skills ADD CONSTRAINT other_skills_skill
    FOREIGN KEY (skill_id)
    REFERENCES skills (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: portfolios_freelancer (table: portfolios)
ALTER TABLE portfolios ADD CONSTRAINT portfolios_freelancer
    FOREIGN KEY (freelancer_id)
    REFERENCES freelancers (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: proposal_freelancer (table: proposals)
ALTER TABLE proposals ADD CONSTRAINT proposal_freelancer
    FOREIGN KEY (freelancer_id)
    REFERENCES freelancers (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: proposal_job (table: proposals)
ALTER TABLE proposals ADD CONSTRAINT proposal_job
    FOREIGN KEY (job_id)
    REFERENCES jobs (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: proposal_proposal_status_catalog (table: proposals)
ALTER TABLE proposals ADD CONSTRAINT proposal_proposal_status_catalog
    FOREIGN KEY (current_proposal_status)
    REFERENCES proposal_status_catalog (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: specialities_categories (table: specialities)
ALTER TABLE specialities ADD CONSTRAINT specialities_categories
    FOREIGN KEY (category_id)
    REFERENCES categories (id)
    ON DELETE  CASCADE 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

