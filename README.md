# RTC Passenger Care

Smart APSRTC Passenger Complaint & Feedback Management System. The workspace contains a React/Vite client, Spring Boot 4 REST API, and MySQL 8 schema. Java source is configured for Java 21.

## Requirements

- Java 21 or newer
- Maven 3.9+
- Node.js 20.19+ and npm
- Docker Compose, or a local MySQL 8 instance

## Configure and start MySQL

Set a local root password and start the database:

```sh
export MYSQL_ROOT_PASSWORD='use-a-local-password'
docker compose up -d mysql
```

The schema and role catalog are loaded on first initialization. The database volume persists between restarts. To use a separately installed MySQL database, create `rtc_passenger_care` and execute `database/schema.sql`.

## Configure the backend

Set the following environment variables in the terminal that will run Spring Boot. Keep real credentials and secrets out of source control.

```sh
export DB_URL='jdbc:mysql://localhost:3306/rtc_passenger_care?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
export DB_USERNAME='root'
export DB_PASSWORD="$MYSQL_ROOT_PASSWORD"
export JWT_SECRET="$(openssl rand -base64 48)"
export ADMIN_EMAIL='admin@example.com'
export ADMIN_PASSWORD='replace-with-a-strong-password'
```

`backend/.env.example` lists the supported application settings. Spring reads these from the process environment; it does not load a `.env` file automatically. The first start seeds an administrator only when both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set. Public registration can create passenger accounts only. To create RTC officers, sign in as the administrator and promote a registered account from People & roles.

Start the API after setting the required environment variables:

```sh
cd backend
mvn spring-boot:run
```

For a local interactive start, run `./backend/run-local.sh` from the workspace root. It prompts for the MySQL username and hidden password, generates a temporary JWT secret for this process, and launches Spring Boot. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your terminal first if you want the first startup to create an administrator.

The API listens on `http://localhost:8080`. Uploaded evidence is stored under `backend/uploads` by default; set `UPLOAD_DIR` to change it. Accepted evidence is JPG, PNG, or PDF up to 5 MB.

## Start the frontend

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). Set `VITE_API_URL` at build/dev time to change the API base URL; it defaults to `http://localhost:8080/api`.

## Verify

```sh
cd backend && mvn test
cd ../frontend && npm run build
```

The backend tests cover JWT signing/parsing and BCrypt password hashing. API persistence and role checks require a running MySQL service for an end-to-end demonstration.

## Main workflows

- Passenger: register, sign in, submit and track complaints, upload evidence, and receive status notifications.
- RTC officer: view assigned cases, inspect the timeline, add investigation remarks, and move cases through review, investigation, resolution, and closure.
- Administrator: review service statistics, manage account roles, assign officers, monitor complaints, and export the complaint register as CSV.

## API routes

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public, passenger only |
| POST | `/api/auth/login` | Public |
| GET | `/api/passenger/dashboard` | Passenger |
| GET | `/api/passenger/notifications` | Passenger |
| PUT | `/api/passenger/notifications/{id}/read` | Passenger |
| POST | `/api/complaints` | Passenger |
| GET | `/api/complaints/my` | Passenger |
| GET | `/api/complaints/{id}` | Owner or assigned officer; administrator |
| GET | `/api/officer/complaints` | RTC officer |
| PUT | `/api/officer/complaints/{id}/status` | Assigned RTC officer |
| GET | `/api/admin/analytics/summary` | Administrator |
| GET | `/api/admin/users` | Administrator |
| PUT | `/api/admin/users/{id}/role?role=RTC_OFFICER` | Administrator |
| GET | `/api/admin/complaints` | Administrator |
| PUT | `/api/admin/complaints/{id}/assign` | Administrator |

Role-protected endpoints use `Authorization: Bearer <JWT>`. Passwords are stored with BCrypt. Replace the local development values and configure HTTPS, a managed secret store, and a production upload store before deployment.