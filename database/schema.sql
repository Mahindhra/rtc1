CREATE DATABASE IF NOT EXISTS rtc_passenger_care
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE rtc_passenger_care;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(30) NOT NULL,
  label VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_roles_code (code)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  gender VARCHAR(30),
  city VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  role_id BIGINT NOT NULL,
  created_at TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  KEY ix_users_role_id (role_id),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE IF NOT EXISTS complaints (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_number VARCHAR(24) NOT NULL,
  passenger_id BIGINT NOT NULL,
  category VARCHAR(60) NOT NULL,
  bus_number VARCHAR(30),
  bus_route VARCHAR(150),
  journey_date DATE,
  location VARCHAR(180),
  description VARCHAR(3000) NOT NULL,
  high_priority BIT(1) NOT NULL,
  status VARCHAR(30) NOT NULL,
  investigation_remarks VARCHAR(2000),
  assigned_officer_id BIGINT,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_complaints_number (complaint_number),
  KEY ix_complaints_passenger_created (passenger_id, created_at),
  KEY ix_complaints_assignee_status (assigned_officer_id, status),
  KEY ix_complaints_priority_status (high_priority, status),
  CONSTRAINT fk_complaints_passenger FOREIGN KEY (passenger_id) REFERENCES users (id),
  CONSTRAINT fk_complaints_officer FOREIGN KEY (assigned_officer_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS complaint_evidence (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id BIGINT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (id),
  KEY ix_evidence_complaint (complaint_id),
  CONSTRAINT fk_evidence_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS complaint_status_history (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id BIGINT NOT NULL,
  previous_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  changed_by_id BIGINT NOT NULL,
  remarks VARCHAR(2000),
  changed_at TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (id),
  KEY ix_history_complaint_time (complaint_id, changed_at),
  CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE,
  CONSTRAINT fk_history_user FOREIGN KEY (changed_by_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  recipient_id BIGINT NOT NULL,
  complaint_id BIGINT,
  message VARCHAR(200) NOT NULL,
  is_read BIT(1) NOT NULL,
  created_at TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (id),
  KEY ix_notifications_recipient_time (recipient_id, created_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (recipient_id) REFERENCES users (id),
  CONSTRAINT fk_notifications_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS officer_assignments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  complaint_id BIGINT NOT NULL,
  officer_id BIGINT NOT NULL,
  assigned_by_id BIGINT NOT NULL,
  assigned_at TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (id),
  KEY ix_assignments_complaint_time (complaint_id, assigned_at),
  KEY ix_assignments_officer_time (officer_id, assigned_at),
  CONSTRAINT fk_assignments_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE,
  CONSTRAINT fk_assignments_officer FOREIGN KEY (officer_id) REFERENCES users (id),
  CONSTRAINT fk_assignments_admin FOREIGN KEY (assigned_by_id) REFERENCES users (id)
);

INSERT IGNORE INTO roles (code, label) VALUES
  ('PASSENGER', 'Passenger'),
  ('RTC_OFFICER', 'RTC Officer'),
  ('ADMIN', 'Administrator');